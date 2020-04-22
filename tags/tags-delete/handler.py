import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def remove_tag(tag_id):
    client = boto3.client('rds-data')

    # delete the tag from the tags table
    sql = "DELETE FROM `tags` WHERE `tag_id` = :tag_id;"
    sql_parameters = [ {'name':'tag_id', 'value':{'longValue': tag_id} } ]
    query_result = execute_statement(client, sql, sql_parameters)
    print("delete from tags table")
    print(query_result)
    print(query_result['numberOfRecordsUpdated'])
    # tag_id didn't actually delete anything
    if ( query_result['numberOfRecordsUpdated'] == 0 ):
        return False

    # delete the tag from the supporter_tags table
    sql = "DELETE FROM `supporter_tags` WHERE `tag_id` = :tag_id;"
    sql_parameters = [ {'name':'tag_id', 'value':{'longValue': tag_id} } ]
    query_result = execute_statement(client, sql, sql_parameters)
    print("delete from supporter_tags table")
    print(query_result)

    return True






def lambda_handler(event, context):

    response_body = {}
    response_headers = {}

    # extract the tag id
    tag_id = int(event["pathParameters"]["id"])

    if ( remove_tag(tag_id) ):
        response_body = { 'message' : 'tag successfully deleted' }
        statusCode = 200
    else:
        statusCode = 404
        response_body = {
            'message' : 'Could not find tag associated with specified tag_id',
            'tag_id' : tag_id
        }

    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"

    return {
        'statusCode': statusCode,
        'headers' : response_headers,
        'body': json.dumps(response_body),
        'isBase64Encoded' : False
    }
