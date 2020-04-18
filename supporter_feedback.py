import boto3
import json

from package import db_config

def supporter_feedbacK(event, context):
    if 'rating' in event:
        rating = event['rating']
    if 'appointment_id' in event:
        appointment_id = event['appointment_id']
    if 'student_id' in event:
        student_id = event['student_id']
    if 'recommended' in event:
        recommended = event['recommended']
    #check these
    
    # add_supporter_rating_query = "SELECT user_id_ FROM supporter WHERE user_id_ = (supporter_id) VALUES (%s)"
    # add_supporter_rating_query = (f"INSERT INTO student_feedback" 
    # f"(appointment_id,student_id,rating,recommended) "
    # f"VALUES(%s,%s,%s,%s)")
    add_supporter_rating_query= (f"INSERT INTO student_feedback" 
    f"(appointment_id,student_id,rating,recommended) "
    f"VALUES({appointment_id},{student_id},{rating},{recommended})")

    # info = (appointment_id, student_id, rating, recommended)

    client = boto3.client('rds-data')

    response = client.execute_statement(resourceArn=db_config.ARN,
    secretArn=db_config.SECRET_ARN,
    sql=add_supporter_rating_query)
    print(response)


