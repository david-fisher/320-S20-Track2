import json
import random
import string
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records

#handler function
def student_create(event, context):
    
    # Headers to avoid CORS issues
    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"
    
    statusCode = 200
    body = json.loads(event["body"])
    
    #test to see if input properly formatted
    if ("email" not in body.keys()):
        statusCode = 400
    if ("password" not in body.keys()):
        statusCode = 400
    if ("first_name" not in body.keys()):
        statusCode = 400
    if ("last_name" not in body.keys()):
        statusCode = 400
    if ("preferred_name" not in body.keys()):
        statusCode = 400
    if ("phone_number" not in body.keys()):
        statusCode = 400
    if ("profile_picture" not in body.keys()):
        statusCode = 400
    if ("request_supporter" not in body.keys()):
        statusCode = 400
    if ("active_account" not in body.keys()):
        statusCode = 400
    if ("GPA" not in body.keys()):
        statusCode = 400
    if ("grad_year" not in body.keys()):
        statusCode = 400
    if ("resume_ref" not in body.keys()):
        statusCode = 400
    if ("transcript_ref" not in body.keys()):
        statusCode = 400
    if ("github_link" not in body.keys()):
        statusCode = 400
    if ("linkedin_link" not in body.keys()):
        statusCode = 400
    if ("is_undergrad" not in body.keys()):
        statusCode = 400
        
    if statusCode == 400:
        response = {}
        response['statusCode'] = statusCode
        response['headers'] = response_headers
        response['body'] = "Invalid Input Body Format!"
        response['isBase64Encoded'] = False
        return response;
    
    #Connect to database
    client = boto3.client('rds-data')

    #Extract fields
    email = body["email"]
    password = body["password"]
    first_name = body["first_name"]
    last_name = body["last_name"]
    preferred_name = body["preferred_name"]
    phone_number = body["profile_picture"]
    profile_picture = body["profile_picture"]
    request_supporter = body["request_supporter"]
    active_account = body["active_account"]
    GPA = body["GPA"]
    grad_year = body["grad_year"]
    resume_ref = body["resume_ref"]
    transcript_ref = body["transcript_ref"]
    github_link = body["github_link"]
    linkedin_link = body["linkedin_link"]
    is_undergrad = body["is_undergrad"]
        
    #Check if email already exists
    sql = "SELECT email FROM user WHERE email = :email;"
    sql_parameters = [ {'name':'email', 'value':{'stringValue': email}} ]
    query_result = execute_statement(client, sql, sql_parameters)
    email_exists = (extract_records(query_result) != [])
        
    if email_exists:
        response = {}
        response['statusCode'] = 404
        response['headers'] = response_headers
        response['body'] = "Email Exists!"
        response['isBase64Encoded'] = False
        return response;
    
    #Find next available user id
    sql = "SELECT MAX(user_id_) FROM user;"
    query_result = execute_statement(client, sql)
    max_id = extract_records(query_result)
    user_id = 0 if len(max_id) == 0 else max_id[0][0]+1
    
    #Insert into user
    sql = "INSERT INTO user VALUES (:user_id, :email, :password, :first_name, :last_name, :preferred_name, :phone_number, :profile_picture, :request_supporter, :active_account);"
    sql_parameters = [ {'name':'user_id', 'value':{'longValue': user_id}} ,
    {'name':'email', 'value':{'stringValue': email}},
    {'name':'password', 'value':{'stringValue': password}},
    {'name':'first_name', 'value':{'stringValue': first_name}},
    {'name':'last_name', 'value':{'stringValue': last_name}},
    {'name':'preferred_name', 'value':{'stringValue': preferred_name}},
    {'name':'phone_number', 'value':{'stringValue': phone_number}},
    {'name':'profile_picture', 'value':{'stringValue': profile_picture}},
    {'name':'request_supporter', 'value':{'booleanValue': request_supporter}},
    {'name':'active_account', 'value':{'booleanValue': active_account}}
    ]
        
    query_result = execute_statement(client, sql, sql_parameters)
    
    
    #Insert into student
    sql = "INSERT INTO student VALUES (:user_id, :GPA, :grad_year, :resume_ref, :transcript_ref, :github_link, :linkedin_link, :is_undergrad);"
    sql_parameters = [ {'name':'user_id', 'value':{'longValue': user_id}} ,
    {'name':'GPA', 'value':{'doubleValue': GPA}},
    {'name':'grad_year', 'value':{'stringValue': grad_year}},
    {'name':'resume_ref', 'value':{'stringValue': resume_ref}},
    {'name':'transcript_ref', 'value':{'stringValue': transcript_ref}},
    {'name':'github_link', 'value':{'stringValue': github_link}},
    {'name':'linkedin_link', 'value':{'stringValue': linkedin_link}},
    {'name':'is_undergrad', 'value':{'booleanValue': is_undergrad}}
    ]
        
    query_result = execute_statement(client, sql, sql_parameters)
    
    #Just return the user id
    user_return = {}
    user_return["user-id"] = user_id
    
    response = {}
    response["statusCode"] = statusCode
    response["headers"] = response_headers
    response["body"] = json.dumps(user_return)
    response["isBase64Encoded"] = False

    return response
