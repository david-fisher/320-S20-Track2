import json
import boto3

def authentication_login(event, context):
    username = event['username']
    password = event['password']

    #Connect to Database
    client = boto3.client('rds-data')
    user = client.execute_statement(
    secretARN = "",
    database = "",
    resourceARN = "",
    sql = "SELECT email FROM user WHERE email = '%s';" % (username)
    )
    
    statusCode = 200
    loginResponse = {}
    
    #Check if user exists
    if(user['records'] == []):
        loginResponse['message'] = 'User DNE'
        statusCode = 404
    
    #Check if password is correct
    client = boto3.client('rds-data')
    pw = client.execute_statement(
    secretARN = "",
    database = "",
    resourceARN = "",
    sql = "SELECT password FROM user WHERE email = '%s';" % (username)
    )
    
    if(not verify_password(password, pw['records'][0][0]['stringValue'])):
        loginResponse['message'] = 'Password Does Not Match'
        statusCode = 404
    
    if(statusCode == 200):
        loginResponse['username'] = username
        loginResponse['password'] = password
        loginResponse['message'] = 'Login Success'

    response = {}
    response['statusCode'] = statusCode
    response['header'] = {}
    response['header']['Content-Type'] = 'application/json'
    response['body'] = json.dumps(loginResponse)

    return response
    
