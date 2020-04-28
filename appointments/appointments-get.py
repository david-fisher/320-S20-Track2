import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def get_appointments(event, context):
    
    response_headers = {}
    
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"
    
    try:
        if not isinstance(int(event["pathParameters"]["id"]), int):
            return {
                'statusCode' : 400,
                'headers' : response_headers,
                'body' : "Input is not a valid id"
            }
    except:
        return {
            'statusCode' : 400,
            'headers' : response_headers,
            'body' : "No input"
        }
   
    u_id = int(event["pathParameters"]["id"])
   
    query = "SELECT * FROM `appointments` WHERE `supporter_id` = :u_id;"
    sql_params = [{'name': 'u_id', 'value':{'longValue': u_id}}]
    query_result = execute_statement(query, sql_params)
   
    if query_result['records'] == []:
        return {
         'statusCode' : 404,
         'headers' : response_headers,
         'body' : "No appointments found"
        }
   
   
    return {
        'statusCode' : 200,
        'headers' : response_headers,
        'body' : json.dumps(extract_records(query_result))
    }
