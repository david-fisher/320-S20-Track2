import json
import random
import string
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records

def token(N=64):
    return ''.join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=N))

def authentication_login(event, context):
    username = event['body']['username']
    password = event['body']['password']

    #Connect to Database
    client = boto3.client('rds-data')
    
    sql = "SELECT email FROM `user` WHERE `email` = :username;"
    sql_parameters = [ {'name':'username', 'value':{'stringValue': '{username}'} ]
    user = execute_statement(client, sql, sql_parameters)
#     user = client.execute_statement(
#     secretARN = "",
#     database = "",
#     resourceARN = "",
#     sql = "SELECT email FROM user WHERE email = '%s';" % (username)   #Convert to db_wrapper
#     )
    
    statusCode = 200
    loginResponse = {}
    
    #Check if user exists
    if(extract_result(user) == []):
        loginResponse['message'] = 'User DNE'
        statusCode = 404
    
    #Check if password is correct
    sql = "SELECT password FROM user WHERE email = :username;"
    sql_parameters = [ {'name':'username', 'value':{'stringValue': '{username}'} ]
    pw = execute_statement(client, sql, sql_parameters)
#     client = boto3.client('rds-data')
#     pw = client.execute_statement(
#     secretARN = "",
#     database = "",
#     resourceARN = "",
#     sql = "SELECT password FROM user WHERE email = '%s';" % (username)
#     )
    
    if(not verify_password(password, pw['records'][0][0]['stringValue'])):
        loginResponse['message'] = 'Password Does Not Match'
        statusCode = 404
    
    if(statusCode == 200):
        loginResponse['username'] = username
        loginResponse['password'] = password
        loginResponse['message'] = 'Login Success'
        loginResponse['token'] = token

    response = {}
    response['statusCode'] = statusCode
    response['header'] = {}
    response['header']['Content-Type'] = 'application/json'
    response['body'] = json.dumps(loginResponse)

    return response
