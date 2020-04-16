import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def get_tags():

    # query the database for all current tags
    sql = "SELECT * FROM tags;"
    query_result = execute_statement(sql)

    # parse the result
    response = extract_records(query_result)
    return response


def lambda_handler(event, context):
    response_body = json.dumps(get_tags())
    # There's no input, so statusCode should be 200 unleses get_tags() throws an error
    response_status = 200

    response = {
        'statusCode' : response_status,
        'body' : response_body
    }
    print(response)

    return response
