import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def remove_option(table_name, option_id):

    # get correct id field
    if (table_name == 'tags'):
        id = 'tag_id'
        associated_table = 'supporter_tags'
    elif (table_name == 'type_of_supporters'):
        id = 'supp_type_id'
        associated_table = 'supporter_type'
    else:
        id = 'type_id'
        associated_table = ''

    # delete the tag from the tags table
    sql = f"DELETE FROM `{table_name}` WHERE `{id}` = :option_id;"
    sql_parameters = [ {'name':'option_id', 'value':{'longValue': option_id} } ]
    query_result = execute_statement(sql, sql_parameters)

    # didn't actually delete anything
    if ( query_result['numberOfRecordsUpdated'] == 0 ):
        return False

    # delete the tag from the supporter_tags table
    sql = f"DELETE FROM `{associated_table}` WHERE `{id}` = :option_id;"
    query_result = execute_statement(sql, sql_parameters)

    return True




def lambda_handler(event, context):

    response_body = {}
    response_headers = {}
    # extract the tag id
    option_id = int(event["pathParameters"]["id"])

    if (not 'resource' in query_params):
        statusCode = 400
        response_body = {'message' : 'Must include a query parameter "resource" set to "tags", "type_of_supporters", or "appointment_type"'}
    elif ( not (query_params['resource'] == 'tags' or query_params['resource'] == 'type_of_supporters' or query_params['resource'] == 'appointment_type') ):
        statusCode = 400
        response_body = {'message' : 'Unknown resource', 'resource' : f'{query_params['resource']}'}
    else:
        if ( remove_option(query_params['resource'], tag_id) ):
            response_body = { 'message' : 'option successfully deleted' }
            statusCode = 200
        else:
            statusCode = 404
            response_body = {
                'message' : 'Could not find option associated with specified id',
                'id' : option_id
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
