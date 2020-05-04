import json
from db_wrapper import execute_statement, extract_records

def lambda_handler(event, context):

    response_headers = {}
    response_body = {}

    request_body = json.loads(event["body"])
    attr_list = ["appointment_id", "user_id_", "rating", "recommended", "questions"]
    if (not all(item in attr_list for item in request_body)):
        statusCode = 400
        response_body = {
        'message' : 'Invalid request format: request body does not contain all the required attributes',
        'request body' : json.dumps(request_body)
        }
    else:
        appointment_id = int(json.loads(event["body"])["appointment_id"])
        user_id_ = int(json.loads(event["body"])["user_id_"])
        rating = int(json.loads(event["body"])["rating"])
        recommended = str(json.loads(event["body"])["recommended"])
        question_list = json.loads(event["body"])["questions"]

        #check if appointment_id and user_id exists in the database
        query = "SELECT appointment_id FROM appointments WHERE appointment_id = :appointment_id;"
        sql_params = [{'name': 'appointment_id', 'value':{'longValue': appointment_id}}]
        existing_appt = execute_statement(query, sql_params)

        query = "SELECT user_id_ FROM student WHERE user_id_ = :user_id_;"
        sql_params = [{'name': 'user_id_', 'value':{'longValue': user_id_}}]
        existing_user = execute_statement(query, sql_params)
    
        if existing_appt['records'] == []:
            return {
                'statusCode': 404,
                'body': json.dumps({ 'message' : 'appointment_id not in database' })
            }

        if existing_user['records'] == []:
            return {
                'statusCode': 404,
                'body': json.dumps({ 'message' : 'user_id_ not in database' })
            }
    
        query = "INSERT INTO student_feedback VALUES (:appointment_id, :user_id_, :rating, :recommended);"
        sql_parameters = [ {'name':'appointment_id', 'value':{'longValue': appointment_id}}, 
                   {'name':'user_id_', 'value':{'longValue': user_id_}},
                   {'name':'rating', 'value':{'longValue': rating}}, 
                   {'name':'recommended', 'value':{'stringValue': recommended}}  ]
        query_result = execute_statement(query, sql_parameters)

        #Insert response to questions into the student_responses table
        if(len(question_list) > 0):
            for question in question_list:
                question_id = int(question["question_id"])
                response = str(question["response"])
                #Check to see if q exists in db
                query = "SELECT question_id FROM supporter_questions WHERE question_id = :question_id;"
                sql_params = [{'name': 'question_id', 'value':{'longValue': question_id}}]
                existing_question = execute_statement(query, sql_params)
                if existing_question['records'] == []:
                    return {
                        'statusCode': 404,
                        'body': json.dumps({ 'message' : 'question_id  not in database' })
                    }
                else:
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
