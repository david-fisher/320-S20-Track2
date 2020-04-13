import boto3
import json

from package import db_config


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


    # reformat tags to be SQL friendly
    tags_ids_sql = "(" + str(tags_ids)[1:-1] + ")"

    num_tags = len(tags_ids)

    # find supporters with matching tags
    tag_query = (f"SELECT user_id_ "
                 f"FROM supporter_tags "
                 f"WHERE tag_id "
                 f"IN {tags_ids_sql} "
                 f"GROUP BY user_id_"
                 f"HAVING COUNT(DISTINCT tag_id) = {num_tags}")

    # access client and execute query
    client = boto3.client('rds-data')

    users_matching_tags = client.execute_statement(resourceArn=db_config.ARN,
                                                   secretArn=db_config.SECRET_ARN,
                                                   sql=tag_query)

    if 'user_id_' in users_matching_tags:
        user_ids = users_matching_tags['user_id_']

    # build query
    query = ""
    if titles:
        query += "title IN (" + str(titles)[1:-1] + ") AND "
    if current_employers:
        query += "current_employer IN (" + str(current_employers)[1:-1] + ") AND "
    if supporter_types:
        query += "supporter_type IN (" + str(supporter_types)[1:-1] + ") AND "
    if user_ids:
        query += "user_id_ IN (" + str(user_ids)[1:-1] + ") AND "

    # finish query (if query is empty return all supporters)
    if query == "":
        query = ("SELECT * "
                 "FROM supporter;")
    else:
        # remove unwanted " AND " sequence at end of query
        query = query[:-5]
        query = ("SELECT * "
                 "FROM supporter "
                 "WHERE " + query + ";")

    response = client.execute_statement(resourceArn=db_config.ARN,
                                        secretArn=db_config.SECRET_ARN,
                                        sql=query)

    return{
        'body': json.dumps(response),
        'statusCode': 200
    }
