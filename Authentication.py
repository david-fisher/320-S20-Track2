import json
import boto3

def authentication_login(event, context):
    username = event['queryStringParameters']['username']
    password = event['queryStringParameters']['password']

    #Connect to Database
    client = boto3.client('rds-data')

    loginResponse = {}
    loginResponse['username'] = username
    loginResponse['password'] = password
    loginResponse['message'] = 'Login Sucess'

    response = {}
    response['statesCode'] = 200
    response['header'] = {}
    response['header']['Content-Type'] = 'application/json'
    response['body'] = json.dumps(loginResponse)

    return response
    
