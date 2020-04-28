import json
from db_wrapper import execute_statement, extract_records

def lambda_handler(event, context):

    response_headers = {}
    response_body = {}
    
    appointment_id = int(json.loads(event["body"])["appointment_id"])
    user_id_ = int(json.loads(event["body"])["user_id_"])
    rating = int(json.loads(event["body"])["rating"])
    recommended = bool(json.loads(event["body"])["recommended"])
    question_list = json.loads(event["body"])["questions"]

    #check if appointment_id and user_id exists in the database
    query = "SELECT appointment_id FROM appointments WHERE appointment_id = :appointment_id;"
    sql_params = [{'name': 'appointment_id', 'value':{'longValue': appointment_id}}]
    existing_appt = execute_statement(query, sql_params)

    query = "SELECT user_id_ FROM user WHERE user_id_ = :user_id_;"
    sql_params = [{'name': 'user_id_', 'value':{'longValue': user_id_}}]
    existing_user = execute_statement(query, sql_params)
    
    if existing_appt['records'] == []:
        return {
            'statusCode': 404,
            'body': json.dumps('Appointment id not in database')
        }

    if existing_user['records'] == []:
        return {
            'statusCode': 404,
            'body': json.dumps('User id not in database')
        }
    
    query = "INSERT INTO student_feedback VALUES (:appointment_id, :user_id_, :rating, :recommended);"
    sql_parameters = [ {'name':'appointment_id', 'value':{'longValue': appointment_id}}, 
                   {'name':'user_id_', 'value':{'longValue': user_id_}},
                   {'name':'rating', 'value':{'longValue': rating}}, 
                   {'name':'recommended', 'value':{'booleanValue': recommended}}  ]
    query_result = execute_statement(query, sql_parameters)

    #Insert response to questions into the student_responses table
    if(len(question_list) > 0):
        for question in question_list:
            question_id = int(question["question_id"])
            response = str(question["response"])
            query = "INSERT INTO student_responses VALUES (:appointment_id, :user_id_, :question_id, :response);"
            sql_parameters = [ {'name':'appointment_id','value':{'longValue': appointment_id}}, 
                   {'name':'user_id_', 'value':{'longValue': user_id_}},
                   {'name':'question_id', 'value':{'longValue': question_id}}, 
                   {'name':'response', 'value':{'stringValue': response}}  ]
            query_result = execute_statement(query, sql_parameters)

    response_body = { 'message' : 'feedback added' }
    statusCode = 201

    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"

    return {
        'statusCode': statusCode,
        'headers' : response_headers,
        'body': json.dumps(response_body),
        'isBase64Encoded' : False
    }
