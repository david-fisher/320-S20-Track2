import json
import time
import datetime
import re
from db_wrapper import execute_statement, extract_records

#Created by Nishant Acharya
#Last Updated 5/3/2020

def lambda_handler(event, context):
    
    #Getting the values to put into the row
    student_id = int(json.loads(event["body"])["student_id"])
    supporter_id = int(json.loads(event["body"])["supporter_id"])
    appt_date = json.loads(event["body"])["appt_date"]
    start_time = json.loads(event["body"])["start_time"]
    duration_min = int(json.loads(event["body"])["duration"])
    type = int(json.loads(event["body"])["type"])
    cancelled = bool(json.loads(event["body"])["cancelled"])
    rating = int(json.loads(event["body"])["rating"])
    recommended = bool(json.loads(event["body"])["recommended"])
    
    #CORS Header
    response_headers = {}
    
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"
    
    #Finding the given student_id to check
    query = "SELECT user_id_ FROM student WHERE user_id_ = :student_id"
    sql_params = [
        {'name' : 'student_id', 'value': {'longValue': student_id}}
    ]
    student_check = execute_statement(query, sql_params)
    
    #Checking if the given student exists
    if(student_check['records'] == []):
        return{
            'body': json.dumps("Student not found!"),
            'headers':response_headers,
            'statusCode': 404,
            'isBase64Encoded': False
            
        }
    
    #Finding the given supporter_id
    query = "SELECT user_id_ FROM supporter WHERE user_id_ = :supporter_id"
    sql_params = [
        {'name' : 'supporter_id', 'value': {'longValue': supporter_id}}
    ]
    supporter_check = execute_statement(query, sql_params)
    
    #Checking if the given supporter_id exists
    if(supporter_check['records'] == []):
        return{
            'body': json.dumps("Supporter not found!"),
            'headers':response_headers,
            'statusCode': 404,
            'isBase64Encoded': False
        }
        
    #Finding the given type_id
    query = "SELECT type_id FROM appointment_type WHERE type_id = :type"
    sql_params = [
       {'name' : 'type', 'value': {'longValue': type}}
    ]
    type_check = execute_statement(query, sql_params)
    
    #Checking if the given type_id exists
    if(type_check['records'] == []):
        return{
           'body': json.dumps("type not found!"),
           'headers':response_headers,
            'statusCode': 404,
            'isBase64Encoded': False
        }
    
    #Checking if the given date string is in the correct format or not
    date_re = re.compile('^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$')
    #Returning bad request if the format is wrong
    if not(date_re.match(appt_date)):
        return{
           'body': json.dumps("Date bad format!"),
           'headers':response_headers,
            'statusCode': 400,
            'isBase64Encoded': False
        }
    
    #Checking if the given time string is in the correct format or not
    time_re = re.compile('^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$')
    #Returning bad request if the format is wrong
    if not(time_re.match(start_time)):
        return{
           'body': json.dumps("Time bad format!"),
           'headers':response_headers,
            'statusCode': 400,
            'isBase64Encoded': False
        }
    
    # Generating a new appointment_id for the current appointment by adding 1 to the last id
    query = "SELECT appointment_id FROM appointments ORDER BY appointment_id DESC LIMIT 1"
    sql_params = []
    new_id = execute_statement(query, sql_params)
    appointment_id = new_id['records'][0][0]['longValue'] + 1
    
    #Inserting the values in the appointments table
    query = """INSERT INTO appointments(appointment_id, supporter_id, date_of_appointment, start_time, duration_in_min, type_id, cancelled) \
        VALUES (:appointment_id, :supporter_id, :appt_date, :start_time, :duration_min, :type, :cancelled)"""
    
    sql_params = [
        {'name' : 'appointment_id', 'value': {'longValue' : appointment_id}},
        {'name' : 'supporter_id', 'value':{'longValue': supporter_id}},
        {'name' : 'appt_date','typeHint': 'DATE', 'value':{'stringValue': appt_date}},
        {'name' : 'start_time', 'typeHint': 'TIME' ,'value':{'stringValue': start_time}},
        {'name' : 'duration_min', 'value': {'longValue' : duration_min}},
        {'name' : 'type', 'value':{'longValue': type}},
        {'name':'cancelled', 'value':{'booleanValue': cancelled}}
    ]  
    
    #Updating the appointment table
    update = execute_statement(query, sql_params)
    
    #Inserting the values in the student_feedback table
    query = """INSERT INTO student_feedback(appointment_id, student_id, rating, recommended) \
        VALUES (:appointment_id, :student_id, :rating, recommended)"""
    
    sql_params = [
        {'name' : 'appointment_id', 'value': {'longValue' : appointment_id}},
        {'name' : 'student_id', 'value':{'longValue': student_id}},
        {'name' : 'rating', 'value': {'longValue' : rating}},
        {'name':'recommended', 'value':{'booleanValue': recommended}}
    ] 
    
    #Updating the student_feedback table
    update = execute_statement(query, sql_params)
    
    
    return {
        'statusCode': 201,
        'body': json.dumps('Appointment created!'),
        'headers': response_headers,
        'isBase64Encoded':False
    }

