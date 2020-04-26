import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def put_option(table_name, option_name):

    # get necessary field names
    if (table_name == 'tags'):
        id = 'tag_id'
        name = 'tag_name'
    elif (table_name == 'type_of_supporters'):
        id = 'supp_type_id'
        name = 'supp_type'
    else:
        id = 'type_id'
        name = 'appointment_name'

    # insert the new tag into the database
    sql = f"INSERT INTO {table_name} ({name}) VALUES :option_name;"
    sql_parameters = [ {'name':'option_name', 'value':{'stringValue': f'{option_name}'}}  ]

    query_result = execute_statement(sql, sql_parameters)
    print(query_result)


    # get id to return
    sql = f"SELECT {id} FROM {table_name} WHERE {name} = :option_name;"
    id_result = execute_statement(sql, sql_parameters)
    print(id_result)

    # return list(id_result['records'][0][0].values())[0]
    return 0



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
    request_body = json.loads(event["body"])

    # does the request body have a value for "name"?
    if (not 'name' in request_body):
        statusCode = 400
        response_body = {
            'message' : 'Invalid request format: request body must contain a value for "name"',
            'request body' : json.dumps(request_body)
        }
        return {
            'statusCode': statusCode,
            'headers' : response_headers,
            'body': json.dumps(response_body),
            'isBase64Encoded' : False
        }


    # if everything passes, we're good!
    id = put_option(table_name, request_body["name"])
    response_body = { 'message' : "resource successfully created, see 'Location' header for URI" }
    response_headers['Location'] = f'/options/{id}'
    statusCode = 201


    return {
        'statusCode': statusCode,
        'headers' : response_headers,
        'body': json.dumps(response_body),
        'isBase64Encoded' : False
    }
