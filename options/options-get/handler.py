import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def get_tags(table_name):

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

    # get query string parameters
    query_params = event["queryStringParameters"]

    if (not 'resource' in query_params):
        statusCode = 400
        response_body = {'message' : 'Must include a query parameter "resource" set to "tags", "type_of_supporters", or "appointment_type"'}
    elif ( not (query_params['resource'] == 'tags' or query_params['resource'] == 'type_of_supporters' or query_params['resource'] == 'appointment_type') ):
        statusCode = 400
        response_body = {'message' : 'Unknown resource', 'resource' : f'{query_params['resource']}'}
    else:
        response_body = get_options(table_name)
        statusCode = 200


    return {
        'statusCode': statusCode,
        'headers' : response_headers,
        'body': json.dumps(response_body),
        'isBase64Encoded' : False
    }
