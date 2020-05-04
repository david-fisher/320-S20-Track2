import json
import boto3
import rds_config
from db_wrapper import execute_statement, extract_records


def get_appointments(event, context):
    
    response_headers = {}
    
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"
    
    try:
        u_id = int(event["pathParameters"]["id"])
    except:
        return {
            'statusCode' : 400,
            'headers' : response_headers,
            'body' : json.dumps({'message' : 'Invalid user id input'})
        }
   
    # Checks if user_id_ is a student id
    query = "SELECT user_id_ FROM student WHERE user_id_ = :u_id"
    sql_params = [
        {'name' : 'u_id', 'value': {'longValue': u_id}}
    ]
    student_check = execute_statement(query, sql_params)
    
    # Checking if the given id does not exist in student then run query for supporter else run query for student
    if(student_check['records'] == []): # Gather for supporters
        query = (
            "SELECT "
                "A.*, U.first_name, U.last_name, T.appointment_name, S.location "
                ", SF.rating "
            "FROM appointments A "
                "LEFT JOIN user U ON U.user_id_ = A.supporter_id "
                "LEFT JOIN appointment_type T ON T.type_id = A.type_id " 
                "LEFT JOIN supporter S ON S.user_id_ = U.user_id_ " 
                "LEFT JOIN student_feedback SF ON SF.appointment_id = A.appointment_id "
                "LEFT JOIN student_responses SR ON SR.appointment_id = A.appointment_id "
            "WHERE A.supporter_id = :u_id GROUP BY A.appointment_id ; "
        )
    else: # Gather for students
        query = (
            "SELECT "
                "A.*, U.first_name, U.last_name, T.appointment_name, SU.location "
                ", SF.rating "
            "FROM appointments A "
                "LEFT JOIN student_feedback SF ON SF.appointment_id = A.appointment_id "
                "LEFT JOIN student S ON SF.student_id = S.user_id_ "
                "LEFT JOIN user U ON U.user_id_ = A.supporter_id "
                "LEFT JOIN appointment_type T ON T.type_id = A.type_id "
                "LEFT JOIN supporter SU ON SU.user_id_ = U.user_id_ "
                "LEFT JOIN student_responses SR ON SR.appointment_id = A.appointment_id "
            "WHERE S.user_id_ = :u_id   GROUP BY A.appointment_id; "
        )
    
    sql_params = [{'name': 'u_id', 'value':{'longValue': u_id}}]
    query_result = execute_statement(query, sql_params)
    response = extract_records(query_result)
    
    query = "SELECT user_id_ FROM student WHERE user_id_ = :u_id"
    sql_params = [
        {'name' : 'u_id', 'value': {'longValue': u_id}}
    ]
    student_check = execute_statement(query, sql_params)
    
    # Checking again but for non-null ratings
    if(student_check['records'] == []): # Gather for supporters
        query2 = (
            "SELECT "
                "A.appointment_id, SF.rating "
            "FROM appointments A " 
                "LEFT JOIN student_feedback SF ON SF.appointment_id = A.appointment_id "
                "LEFT JOIN student_responses SR ON SR.appointment_id = A.appointment_id "
            "WHERE A.supporter_id = :u_id AND SF.rating IS NOT NULL GROUP BY A.appointment_id; "
        )
    else: # Gather for students
        query2 = (
            "SELECT "
                "A.appointment_id, SF.rating "
            "FROM appointments A "
                "LEFT JOIN student_feedback SF ON SF.appointment_id = A.appointment_id "
                "LEFT JOIN student S ON SF.student_id = S.user_id_ "
                "LEFT JOIN user U ON U.user_id_ = A.supporter_id "
            "WHERE S.user_id_ = :u_id AND SF.rating IS NOT NULL GROUP BY A.appointment_id; "
        )
           
    query_result = execute_statement(query2, sql_params)
    
    response2 = extract_records(query_result)
    
    for entry in response:
        if response2 == []:
            entry[11] = False
        elif entry[0] == response2[0][0] and entry[11]:
            entry[11] = True
            response2.pop(0)
        else:
            entry[11] = False
        
            
    return {
        'statusCode' : 200,
        'headers' : response_headers,
        'body' : json.dumps(response)
    }
