import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def put_tag(tag_name):
    client = boto3.client('rds-data')

    # query database to get next id number
    sql = "SELECT MAX(tag_id) FROM tags;"
    query_result = execute_statement(client, sql)
    max_id = extract_records(query_result)
    tag_id = 0 if len(max_id) == 0 else max_id[0][0]+1

    # insert the new tag into the database
    sql = "INSERT INTO tags VALUES (:tag_id, :tag_name);"
    sql_parameters = [ {'name':'tag_id', 'value':{'longValue': tag_id}}, {'name':'tag_name', 'value':{'stringValue': f'{tag_name}'}}  ]

    query_result = execute_statement(client, sql, sql_parameters)
    print(query_result)

    return tag_id



def lambda_handler(event, context):

    response_headers = {}
    response_body = {}

    # extract the tag_name
    request_body = json.loads(event["body"])
    # print(request_body)
    if (not 'tag_name' in request_body):
        statusCode = 400
        response_body = {
        'message' : 'Invalid request format: request body must contain a value for tag_name.',
        'request body' : json.dumps(request_body)
        }
    else:
        tag_id = put_tag(request_body['tag_name'])
        response_body = { 'message' : 'tag successfully created, see Location header for URI' }
        response_headers['Location'] = f'/tags/{tag_id}'
        statusCode = 201

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
