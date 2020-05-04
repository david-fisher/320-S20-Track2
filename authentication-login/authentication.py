import json
import random
import string
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records

def token(N=64):
    return ''.join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=N))

def authentication_login(event, context):

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
        
    #Check if password is correct & if user has active account
    else:
        sql = "SELECT password_ FROM `user` WHERE `email` = :username;"
        sql_parameters = [ {'name':'username', 'value':{'stringValue': username}} ]
        pw = execute_statement(client, sql, sql_parameters)
     
        if(not(password == pw['records'][0][0]['stringValue'])):
            loginResponse['message'] = 'Password Does Not Match'
            statusCode = 404
            
        sql = "SELECT active_account FROM `user` WHERE `email` = :username;"
        sql_parameters = [ {'name':'username', 'value':{'stringValue': username}} ]
        act = execute_statement(client, sql, sql_parameters)
        
        if not act['records'][0][0]['booleanValue']:
            loginResponse['message'] = 'Not an active account'
            statusCode = 404
    
    if(statusCode == 200):
        sql = "SELECT user_id_ FROM `user` WHERE `email` = :username;"
        sql_parameters = [ {'name':'username', 'value':{'stringValue': username}} ]
        id = execute_statement(client, sql, sql_parameters)
        id_num = id['records'][0][0]['longValue']
        
        sql = "SELECT user_id_ FROM `supporter` WHERE `user_id_` = :id_num;"
        sql_parameters = [ {'name':'id_num', 'value':{'longValue': id_num}} ]
        supporter = execute_statement(client, sql, sql_parameters)
        supporter_exist = extract_records(supporter)
        
        sql = "SELECT admin_id FROM `admin` WHERE `email` = :username;"
        sql_parameters = [ {'name':'username', 'value':{'stringValue': username}} ]
        admin = execute_statement(client, sql, sql_parameters)
        admin_exist = extract_records(admin)
        
        loginResponse["username"] = username
        loginResponse["password"] = password
        loginResponse["message"] = 'Login Success'
        loginResponse["type"] = "supporter" if supporter_exist != [] else "student"
        loginResponse["isAdmin"] = admin_exist != []
        loginResponse["user-id"] = id_num
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
