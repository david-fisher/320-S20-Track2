import json
import sys
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def remove_option(table_name, option_id):

    # get necessary field names
    if (table_name == 'tags'):
        id = 'tag_id'
        name = 'tag_name'
        associated_table = 'supporter_tags'
    elif (table_name == 'type_of_supporter'):
        id = 'supp_type_id'
        name = 'supp_type'
        associated_table = 'supporter_type'
    else:
        id = 'type_id'
        name = 'appointment_name'

    # delete the tag from the tags table
    sql = f"DELETE FROM `{table_name}` WHERE `{id}` = :option_id;"
    sql_parameters = [ {'name':'option_id', 'value':{'longValue': option_id} } ]
    query_result = execute_statement(sql, sql_parameters)

    # didn't actually delete anything
    if ( query_result['numberOfRecordsUpdated'] == 0 ):
        return False

    if (id == 'tag_id' or id == 'supp_type_id'):
        # delete the tag from the supporter_tags table (not for appointment_type)
        sql = f"DELETE FROM `{associated_table}` WHERE `{id}` = :option_id;"
        query_result = execute_statement(sql, sql_parameters)

    return True




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

    table_name = event["queryStringParameters"]["resource"]

    try:
        # extract the tag id
        option_id = int(event["pathParameters"]["id"])
        if ( remove_option(query_params['resource'], tag_id) ):
            response_body = { 'message' : f'option {option_id} successfully deleted' }
            statusCode = 200
        else:
            statusCode = 404
            response_body = {
                'message' : f'Could not find {option_id} in {table_name}'
            }
    except ValueError:
        statusCode = 400
        response_body = {
            'message' : '{id} path parameter must be an integer'
        }


    return {
        'statusCode': statusCode,
        'headers' : response_headers,
        'body': json.dumps(response_body),
        'isBase64Encoded' : False
    }
