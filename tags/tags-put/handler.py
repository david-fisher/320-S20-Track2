import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def put_tag(tag_name):
    client = boto3.client('rds-data')

    # query database to get next id number
    sql = "SELECT MAX(tag_id) FROM tags;"
    query_result = execute_statement(client, sql)
    max_id = extract_records(query_result)
    tag_id = 0 if len(max_id) == 0 else max_id[0][0]+1

    # insert the new tag into the database
    sql = "INSERT INTO tags VALUES (:tag_id, :tag_name);"
    sql_parameters = [ {'name':'tag_id', 'value':{'longValue': tag_id}}, {'name':'tag_name', 'value':{'stringValue': f'{tag_name}'}}  ]

    query_result = execute_statement(client, sql, sql_parameters)
    print(query_result)

    return {}






def lambda_handler(event, context):

    # extract the tag_name
    tag_name = event["body"]["tag_name"]

    response = put_tag(tag_name)

    statusCode = 200

    return {
        'statusCode': statusCode,
        'body': {}
    }
