import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def get_options(table_name):

    # query the database for all current tags
    sql = f"SELECT * FROM {table_name};"
    query_result = execute_statement(sql)

    # parse the result
    response = extract_records(query_result)
    return response


def lambda_handler(event, context):
    response_headers = {}
    response_body = {}

    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"

    # does the necessary query string exist?
    if (event["queryStringParameters"] == None or not 'resource' in event["queryStringParameters"]):
        statusCode = 400
        response_body = {'message' : 'Must include a query parameter "resource" set to "tags", "type_of_supporter", or "appointment_type"'}
        return {
            'statusCode': statusCode,
            'headers' : response_headers,
            'body': json.dumps(response_body),
            'isBase64Encoded' : False
        }

    table_name = event["queryStringParameters"]["resource"]

    # does the query string have an acceptable value?
    if (not (table_name == 'tags' or table_name == 'type_of_supporter' or table_name == 'appointment_type') ):
        statusCode = 400
        response_body = {'message' : 'Unknown resource', 'resource' : f'{table_name}'}
        return {
            'statusCode': statusCode,
            'headers' : response_headers,
            'body': json.dumps(response_body),
            'isBase64Encoded' : False
        }


    # if both pass, we're good!
    response_body = get_options(table_name)
    statusCode = 200


    return {
        'statusCode': statusCode,
        'headers' : response_headers,
        'body': json.dumps(response_body),
        'isBase64Encoded' : False
    }
