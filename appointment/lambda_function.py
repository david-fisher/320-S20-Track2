import json
import time
import datetime
import re
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
    rating = int(event['rating'])
    recommended = bool(event['recommended'])
    
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
            'statusCode': 404
        }
    
    #Checking if the given date string is in the correct format or not
    
    
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
        'body': json.dumps('Appointment created!')
    }
