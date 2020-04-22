import boto3
import json
import rds_config


# generates a list for SQL of variables to be passed over separately e.g. "(%s, %s, %s, %s)"
def sql_list(length):
    param_list = "("
    for i in range(length):
        param_list += "%s, "
    return param_list[:-2] + ")"

# converts variables into boto3 SQL query input parameters. Also appends variables to existing SQL params if included
def param_to_sql_param(params, existing_sql_params=None):
    name_index = 0
    if existing_sql_params:
        name_index = len(existing_sql_params)

    sql_params = []
    for param in params:

        var_type = type(param)
        if var_type is str:
            value = {
                'stringValue': param
            }
        elif var_type is int:
            value = {
                'longValue': param
            }
        elif var_type is float:
            value = {
                'doubleValue': param
            }
        elif var_type is bool:
            value = {
                'booleanValue': param
            }

        sql_params.append({
            'name': str(name_index),
            'value': value
        })
        name_index += 1

    if existing_sql_params:
        return existing_sql_params + sql_params
    return sql_params

def get_filtered_supporters(event, context):

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
                 f"IN :0 "
                 f"GROUP BY user_id_"
                 f"HAVING COUNT(DISTINCT tag_id) = :1")

    tag_params = param_to_sql_param([tags_ids_sql, num_tags])

    # access client and execute query
    client = boto3.client('rds-data')

    tag_response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=tag_query,
                                            parameters=tag_params)

    user_ids = tag_response['records']


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
