import json
import random
import string
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records

'''
"email": "timmy@gmail.com",     
"password": "askdj12",     
"first_name": "Timothy",     
"last_name": "Shook",     
"preferred_name": "Timmy",     
"phone_number": 2039482938,     
"profile_picture": "",    
"request_supporter": false,   
"active_account": true,  
"GPA": 3.5,    
"grad_year": 2021,     
"resume_ref": "",    
"transcript_ref": "",    
"github_link": "github.com/adwj",    
"linkedin_link": "",  
"is_undergrad": true
'''



def student_create(event, context):

    username = json.loads(event["body"])["username"]
    password = json.loads(event["body"])["password"]

    #Connect to Database
    client = boto3.client('rds-data')
    
    sql = "SELECT email FROM `user` WHERE `email` = :username;"
    sql_parameters = [ {'name':'username', 'value':{'stringValue': username}} ]
    user = execute_statement(client, sql, sql_parameters)
    
    statusCode = 200
    loginResponse = {}
    
    #Check if user exists
    if(extract_records(user) == []):
        loginResponse['message'] = 'User DNE'
        statusCode = 404
    
    #Check if password is correct
    else:
        sql = "SELECT password_ FROM `user` WHERE `email` = :username;"
        sql_parameters = [ {'name':'username', 'value':{'stringValue': username}} ]
        pw = execute_statement(client, sql, sql_parameters)
     
        if(not(password == pw['records'][0][0]['stringValue'])):
            loginResponse['message'] = 'Password Does Not Match'
            statusCode = 404
    
    if(statusCode == 200):
        loginResponse["username"] = username
        loginResponse["password"] = password
        loginResponse["message"] = 'Login Success'
        loginResponse["token"] = token()
    
    # Headers to avoid CORS issues
    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"
    
    response = {}
    response["statusCode"] = statusCode
    # response["headers"] = {"Content-Type": "application/json"}
    response["headers"] = response_headers
    response["body"] = json.dumps(loginResponse)
    response["isBase64Encoded"] = False

    return response
