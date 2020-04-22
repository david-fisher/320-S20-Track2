import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records

def report(event, context):

    supporter_id = event['body']['supporter_id']

    # Connect to database
    client = boto3.client('rds-data')


    sql = 'SELECT supporter_id FROM `supporters` WHERE `supporter_id` = :supporter_id;'
    sql_parameters = [{'name':'supporter_id', 'value' : {'longValue': supporter_id}}]
    user = execute_statement(client, sql, sql_parameters)

    # If the user does not exist
    if(extract_records(user) == []):
        return{
            'body': json.dumps("The user does not exist"),
            'statusCode': 404
        }
        
    # If the user exist    
    else:
        sql = ''