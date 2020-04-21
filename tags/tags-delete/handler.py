import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def remove_tag(tag_id):
    client = boto3.client('rds-data')

    # delete the tag from the tags table
    sql = "DELETE FROM `tags` WHERE `tag_id` = :tag_id;"
    sql_parameters = [ {'name':'tag_id', 'value':{'longValue': tag_id} ]
    query_result = execute_statement(client, sql, sql_parameters)
    print("delete from tags table")
    print(query_result)

    # delete the tag from the supporter_tags table
    sql = "DELETE FROM `supporter_tags` WHERE `tag_id` = :tag_id;"
    sql_parameters = [ {'name':'tag_id', 'value':{'longValue': tag_id} ]
    query_result = execute_statement(client, sql, sql_parameters)
    print("delete from supporter_tags table")
    print(query_result)

    return {}






def lambda_handler(event, context):

    # extract the tag id
    tag_id = int(event["pathParameters"]["id"])
    response_body = remove_tag(tag_id)

    statusCode = 204

    return {
        'statusCode': statusCode,
        'body': json.dumps(response_body)
    }
