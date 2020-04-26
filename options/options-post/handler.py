import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def put_option(table_name, option_name):

    # insert the new tag into the database
    sql = f"INSERT INTO {table_name} VALUES :option_name;"
    sql_parameters = [ {'name':'option_name', 'value':{'stringValue': f'{option_name}'}}  ]

    query_result = execute_statement(client, sql, sql_parameters)
    print(query_result)

    # get id of newly created resource
    if (table_name == 'tags'):
        id = 'tag_id'
        name = 'tag_name'
    elif (table_name == 'type_of_supporters'):
        id = 'supp_type_id'
        name = 'supp_type'
    else:
        id = 'type_id'
        name = 'appointment_name'
    sql = f"SELECT {id} FROM {table_name} WHERE {name} = :option_name;"
    id_result = execute_statement(sql, sql_parameters)

    return list(id_result['records'][0][0].values())[0]



def lambda_handler(event, context):

    response_headers = {}
    response_body = {}

    query_params = event["queryStringParameters"]
    request_body = json.loads(event["body"])

    if (not 'resource' in query_params):
        statusCode = 400
        response_body = {'message' : 'Must include a query parameter "resource" set to "tags", "type_of_supporters", or "appointment_type"'}
    elif ( not (query_params['resource'] == 'tags' or query_params['resource'] == 'type_of_supporters' or query_params['resource'] == 'appointment_type') ):
        statusCode = 400
        response_body = {'message' : 'Unknown resource', 'resource' : f'{query_params['resource']}'}
    elif (not 'name' in request_body):
        statusCode = 400
        response_body = {
        'message' : 'Invalid request format: request body must contain a value for "name".',
        'request body' : json.dumps(request_body)
        }
    else:
        id = put_option(query_params['resource'], request_body["name"])
        response_body = { 'message' : 'resource successfully created, see Location header for URI' }
        response_headers['Location'] = f'/options/{id}'
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
