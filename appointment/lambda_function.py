import json
import time
import datetime
from db_wrapper import execute_statement, extract_records

#Created by Nishant Acharya
#Last Updated 4/22/2020

def lambda_handler(event, context):
    
    #Getting the values to put into the row
    student_id = int(event['student_id'])
    supporter_id = int(event['supporter_id'])
    appt_date = event['appt_date']
    start_time = event['start_time']
    duration_min = int(event['duration'])
    type = int(event['type'])
    cancelled = bool(event['cancelled'])
    
    #Findinf the given student_id to check
    query = "SELECT user_id_ FROM student WHERE user_id_ = :student_id"
    sql_params = [
        {'name' : 'student_id', 'value': {'longValue': student_id}}
    ]
    student_check = execute_statement(query, sql_params)
    
    #Checking if the given student exists
    if(student_check['records'] == []):
        return{
            'body': json.dumps("Student not found!"),
            'statusCode': 404
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
            'statusCode': 404
        }
    
    # Generating a new appointment_id for the current appointment by adding 1 to the last id
    query = "SELECT appointment_id FROM appointments ORDER BY appointment_id DESC LIMIT 1"
    sql_params = []
    new_id = execute_statement(query, sql_params)
    appointment_id = new_id['records'][0][0]['longValue'] + 1
    
    query = """INSERT INTO appointments(appointment_id, supporter_id, date_of_appointment, start_time, duration_in_min, type_id, cancelled) \
        VALUES (:appointment_id, :supporter_id, :appt_date, :start_time, :duration_min, :type, :cancelled)"""
    
    sql_params = [
        {'name' : 'appointment_id', 'value': {'longValue' : appointment_id}},
        {'name' : 'supporter_id', 'value':{'longValue': supporter_id}},
        {'name' : 'appt_date','typeHint': 'DATE', 'value':{'stringValue': appt_date}},
        {'name' : 'start_time', 'typeHint': 'TIME' ,'value':{'stringValue': start_time}},
        {'name' : 'duration_min', 'value': {'longValue' : duration_min}},
        {'name' : 'type', 'value':{'longValue': type}},
        {'name':'cancelled', 'value':{'booleanValue': cancelled}},
    ]  
    
    #Updating the appointment table
    update = execute_statement(query, sql_params)
    
    #Update the student-appointment relationship row in some table
    
    return {
        'statusCode': 201,
        'body': json.dumps('Appointment created!')
    }

