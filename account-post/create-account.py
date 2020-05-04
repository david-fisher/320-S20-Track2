import json
import random
import string
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def student_create(body, response_headers):
    
    statusCode = 200
    
    #Test to see if input properly formatted
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
    if ("description" not in body.keys()):
        statusCode = 400
    if ("pronouns" not in body.keys()):
        statusCode = 400
    
        
    if statusCode == 400:
        response = {}
        response['statusCode'] = statusCode
        response['headers'] = response_headers
        response['body'] = "Invalid Input Body Format!"
        response['isBase64Encoded'] = False
        return response;
    
    #Primarily for student    
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
    if ("college" not in body.keys()):
        statusCode = 400
    if ("program" not in body.keys()):
        statusCode = 400
    if ("job_search" not in body.keys()):
        statusCode = 400
    if ("work_auth" not in body.keys()):
        statusCode = 400
    
    if statusCode == 400:
        response = {}
        response['statusCode'] = statusCode
        response['headers'] = response_headers
        response['body'] = "Invalid Student Body Format!"
        response['isBase64Encoded'] = False
        return response;
    
    #Connect to database
    client = boto3.client('rds-data')

    #Extract user fields
    email = body["email"]
    password = body["password"]
    first_name = body["first_name"]
    last_name = body["last_name"]
    preferred_name = body["preferred_name"]
    phone_number = body["phone_number"]
    profile_picture = body["profile_picture"]
    request_supporter = body["request_supporter"]
    active_account = body["active_account"]
    description = body["description"]
    pronouns = body["pronouns"]
    
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
    sql = "INSERT INTO user VALUES (:user_id, :email, :password, :first_name, :last_name, :preferred_name, :phone_number, :profile_picture, :request_supporter, :active_account, :description, :pronouns);"
    sql_parameters = [ {'name':'user_id', 'value':{'longValue': user_id}} ,
    {'name':'email', 'value':{'stringValue': email}},
    {'name':'password', 'value':{'stringValue': password}},
    {'name':'first_name', 'value':{'stringValue': first_name}},
    {'name':'last_name', 'value':{'stringValue': last_name}},
    {'name':'preferred_name', 'value':{'stringValue': preferred_name}},
    {'name':'phone_number', 'value':{'stringValue': phone_number}},
    {'name':'profile_picture', 'value':{'stringValue': profile_picture}},
    {'name':'request_supporter', 'value':{'booleanValue': request_supporter}},
    {'name':'active_account', 'value':{'booleanValue': active_account}},
    {'name':'description', 'value':{'stringValue': description}},
    {'name':'pronouns', 'value':{'stringValue': pronouns}}
    ]
        
    query_result = execute_statement(client, sql, sql_parameters)
    
    #Extract student fields
    GPA = body["GPA"]
    grad_year = body["grad_year"]
    resume_ref = body["resume_ref"]
    transcript_ref = body["transcript_ref"]
    github_link = body["github_link"]
    linkedin_link = body["linkedin_link"]
    is_undergrad = body["is_undergrad"]
    college = body["college"]
    program = body["program"]
    job_search = body["job_search"]
    work_auth = body["work_auth"]
    
    #Insert into student
    sql = "INSERT INTO student VALUES (:user_id, :GPA, :grad_year, :resume_ref, :transcript_ref, :github_link, :linkedin_link, :is_undergrad, :college, :program, :job_search, :work_auth);"
    sql_parameters = [ {'name':'user_id', 'value':{'longValue': user_id}} ,
    {'name':'GPA', 'value':{'doubleValue': GPA}},
    {'name':'grad_year', 'value':{'longValue': grad_year}},
    {'name':'resume_ref', 'value':{'stringValue': resume_ref}},
    {'name':'transcript_ref', 'value':{'stringValue': transcript_ref}},
    {'name':'github_link', 'value':{'stringValue': github_link}},
    {'name':'linkedin_link', 'value':{'stringValue': linkedin_link}},
    {'name':'is_undergrad', 'value':{'booleanValue': is_undergrad}},
    {'name':'college', 'value':{'stringValue': college}},
    {'name':'program', 'value':{'stringValue': program}},
    {'name':'job_search', 'value':{'booleanValue': job_search}},
    {'name':'work_auth', 'value':{'stringValue': work_auth}}
    ]
        
    query_result = execute_statement(client, sql, sql_parameters)
    
    response = {}
    response["statusCode"] = statusCode
    response["headers"] = response_headers
    response["body"] = json.dumps("user-id: %d"%user_id)
    response["isBase64Encoded"] = False

    return response
    
    
    
    
    
    
    
    
def supporter_create(body, response_headers):
    
    statusCode = 200
    
    #Test to see if input properly formatted
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
    if ("description" not in body.keys()):
        statusCode = 400
    if ("pronouns" not in body.keys()):
        statusCode = 400
    
        
    if statusCode == 400:
        response = {}
        response['statusCode'] = statusCode
        response['headers'] = response_headers
        response['body'] = "Invalid Input Body Format!"
        response['isBase64Encoded'] = False
        return response;
    
    #Primarily for supporter    
    if ("title" not in body.keys()):
        statusCode = 400
    if ("current_employer" not in body.keys()):
        statusCode = 400
    if ("location" not in body.keys()):
        statusCode = 400
    if ("calendar_ref" not in body.keys()):
        statusCode = 400
    if ("calendar_sync" not in body.keys()):
        statusCode = 400
    if ("calendar_sync_freq" not in body.keys()):
        statusCode = 400
    
    if statusCode == 400:
        response = {}
        response['statusCode'] = statusCode
        response['headers'] = response_headers
        response['body'] = "Invalid Supporter Body Format!"
        response['isBase64Encoded'] = False
        return response;
    
    #Connect to database
    client = boto3.client('rds-data')

    #Extract user fields
    email = body["email"]
    password = body["password"]
    first_name = body["first_name"]
    last_name = body["last_name"]
    preferred_name = body["preferred_name"]
    phone_number = body["phone_number"]
    profile_picture = body["profile_picture"]
    request_supporter = body["request_supporter"]
    active_account = body["active_account"]
    description = body["description"]
    pronouns = body["pronouns"]
    
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
    sql = "INSERT INTO user VALUES (:user_id, :email, :password, :first_name, :last_name, :preferred_name, :phone_number, :profile_picture, :request_supporter, :active_account, :description, :pronouns);"
    sql_parameters = [ {'name':'user_id', 'value':{'longValue': user_id}} ,
    {'name':'email', 'value':{'stringValue': email}},
    {'name':'password', 'value':{'stringValue': password}},
    {'name':'first_name', 'value':{'stringValue': first_name}},
    {'name':'last_name', 'value':{'stringValue': last_name}},
    {'name':'preferred_name', 'value':{'stringValue': preferred_name}},
    {'name':'phone_number', 'value':{'stringValue': phone_number}},
    {'name':'profile_picture', 'value':{'stringValue': profile_picture}},
    {'name':'request_supporter', 'value':{'booleanValue': request_supporter}},
    {'name':'active_account', 'value':{'booleanValue': active_account}},
    {'name':'description', 'value':{'stringValue': description}},
    {'name':'pronouns', 'value':{'stringValue': pronouns}}
    ]
        
    query_result = execute_statement(client, sql, sql_parameters)
    
    #Extract supporter fields
    title = body["title"]
    current_employer = body["current_employer"]
    location = body["location"]
    calendar_ref = body["calendar_ref"]
    calendar_sync = body["calendar_sync"]
    calendar_sync_freq = body["calendar_sync_freq"]
    
    #Insert into supporter
    sql = "INSERT INTO supporter VALUES (:user_id, :title, :current_employer, :location, :calendar_ref, :calendar_sync, :calendar_sync_freq);"
    sql_parameters = [ {'name':'user_id', 'value':{'longValue': user_id}} ,
    {'name':'title', 'value':{'stringValue': title}},
    {'name':'current_employer', 'value':{'stringValue': current_employer}},
    {'name':'location', 'value':{'stringValue': location}},
    {'name':'calendar_ref', 'value':{'stringValue': calendar_ref}},
    {'name':'calendar_sync', 'value':{'booleanValue': calendar_sync}},
    {'name':'calendar_sync_freq', 'value':{'longValue': calendar_sync_freq}}
    ]
        
    query_result = execute_statement(client, sql, sql_parameters)
    
    response = {}
    response["statusCode"] = statusCode
    response["headers"] = response_headers
    response["body"] = json.dumps("user-id: %d"%user_id)
    response["isBase64Encoded"] = False

    return response

#handler function
def account_create(event, context):
    
    # Headers to avoid CORS issues
    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"
    
    body = json.loads(event["body"])
    
    #Check for malformed kind
    if("kind" not in body.keys() or (body["kind"] != "student" and body["kind"] != "supporter")):
        response = {}
        response['statusCode'] = 404
        response['headers'] = response_headers
        response['body'] = "Invalid User Kind!"
        response['isBase64Encoded'] = False
        return response;
        
    if body["kind"] == "student":
        return student_create(body, response_headers)
    elif body["kind"] == "supporter":
        return supporter_create(body, response_headers)
    
    
