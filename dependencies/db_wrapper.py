import boto3
import rds_config

'''
    args:
        sql: the SQL statement to be executed
        sql_parameters: the properly formated sql_parameters to be applied

    returns:
        The response from the database in boto3 format
'''
def execute_statement(sql, sql_parameters=[]):
    client = boto3.client('rds-data')

    response = client.execute_statement(
        secretArn=rds_config.SECRET_ARN,
        database=rds_config.DB_NAME,
        resourceArn=rds_config.ARN,
        sql=sql,
        parameters=sql_parameters
    )
    return response

'''
    args:
        query_result: the return value of a boto3 execute_statement call

    returns:
        A list representing the retrieved records from a call to execute_statement.
        Each element in the list is a tuple with the retrieved fields as values
        in the same order as they would be in the database.
'''
def extract_records(query_result):
    records = []
    for record in query_result['records']:
        parsed = [ list(field.values())[0] for field in record ]
        records.append( parsed )
    return records
