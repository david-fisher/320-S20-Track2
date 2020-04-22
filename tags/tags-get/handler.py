import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def get_tags():
    client = boto3.client('rds-data')

    # query the database for all current tags
    sql = "SELECT * FROM tags;"
    query_result = execute_statement(client, sql)

    # parse the result
    response = extract_records(query_result)
    return response


def lambda_handler(event, context):

    response_headers = {}
    response_body = {}

    response_body = get_tags()
    statusCode = 200

    response_headers["Access-Control-Allow-Origin"] = "*"

    return {
        'statusCode': statusCode,
        'headers' : response_headers,
        'body': json.dumps(response_body),
        'isBase64Encoded' : False
    }
