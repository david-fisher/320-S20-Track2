import boto3
import rds_config

def execute_statement(client, sql, sql_parameters=[]):
    response = client.execute_statement(
        secretArn=rds_config.SECRET_ARN,
        database=rds_config.DB_NAME,
        resourceArn=rds_config.ARN,
        sql=sql,
        parameters=sql_parameters
    )
    return response

def extract_records(query_result):
    records = []
    for record in query_result['records']:
        parsed = [ list(field.values())[0] for field in record ]
        records.append( parsed )
    return records
