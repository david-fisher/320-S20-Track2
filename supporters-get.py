import boto3
import json

from package import db_config


# generates a list for SQL of variables to be passed over separately e.g. "(%s, %s, %s, %s)"
def sql_list(length):
    param_list = "("
    for i in range(length):
        param_list += "%s, "
    return param_list[:-2] + ")"

# converts variables into boto3 SQL query input parameters. Also appends variables to existing SQL params if included
def param_to_sql_param(params, existing_sql_params=None):
    sql_params = []
    for param in params:
        sql_params.append({
            'value': param
        })
    if existing_sql_params:
        return existing_sql_params + sql_params
    return sql_params

def get_supporters(event, context):

    # identify filters
    if 'titles' in event:
        titles = event['titles']
    if 'current_employers' in event:
        current_employers = event['current_employers']
    if 'supporter_types' in event:
        supporter_types = event['supporter_types']
    if 'tags' in event:
        tags_ids = event['tags']


    # reformat tags to be SQL friendly and injection unfriendly
    num_tags = len(tags_ids)
    tags_ids_sql = sql_list(num_tags)


    # find supporters with matching tags
    tag_query = (f"SELECT user_id_ "
                 f"FROM supporter_tags "
                 f"WHERE tag_id "
                 f"IN {tags_ids_sql} "
                 f"GROUP BY user_id_"
                 f"HAVING COUNT(DISTINCT tag_id) = {num_tags}")

    tag_params = param_to_sql_param(tags_ids)

    # access client and execute query
    client = boto3.client('rds-data')

    tag_response = client.execute_statement(resourceArn=db_config.ARN,
                                            secretArn=db_config.SECRET_ARN,
                                            sql=tag_query,
                                            parameters=tag_params)

    users_matching_tags = tag_response['records']

    if 'user_id_' in users_matching_tags['records']:
        user_ids = users_matching_tags['user_id_']

    # build query and params
    query = ""
    params = []

    if titles:
        query += "title IN " + sql_list(len(titles)) + " AND "
        param_to_sql_param(titles, params)
    if current_employers:
        query += "current_employer IN " + sql_list(len(current_employers)) + " AND "
        param_to_sql_param(current_employers, params)
    if supporter_types:
        query += "supporter_type IN " + sql_list(len(supporter_types)) + " AND "
        param_to_sql_param(supporter_types, params)
    if user_ids:
        query += "user_id_ IN " + sql_list(len(user_ids)) + " AND "
        param_to_sql_param(user_ids, params)

    # finish query (if query is empty return all supporters)
    if query == "":
        query = ("SELECT * "
                 "FROM supporter;")
        response = client.execute_statement(resourceArn=db_config.ARN,
                                            secretArn=db_config.SECRET_ARN,
                                            sql=query)

    else:
        # remove unwanted " AND " sequence at end of query
        query = query[:-5]
        query = ("SELECT * "
                 "FROM supporter "
                 "WHERE " + query + ";")
        response = client.execute_statement(resourceArn=db_config.ARN,
                                            secretArn=db_config.SECRET_ARN,
                                            sql=query,
                                            parameters=params)

    return{
        'body': json.dumps(response),
        'statusCode': 200
    }
