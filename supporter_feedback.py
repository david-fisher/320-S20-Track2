import boto3
import json
import rds_config

def supporter_feedback(event, context):
    if 'rating' in event:
        rating = event['rating']
    if 'appointment_id' in event:
        appointment_id = event['appointment_id']
    if 'student_id' in event:
        student_id = event['student_id']
    if 'recommended' in event:
        recommended = event['recommended']
        
    add_supporter_rating_query= (f"INSERT INTO student_feedback" 
    f"(appointment_id,student_id,rating,recommended) "
    f"VALUES(%s,%s,%s,%s)")

    info = param_to_sql_param([appointment_id, student_id, rating, recommended])

    client = boto3.client('rds-data')

    response = client.execute_statement(resourceArn=rds_config.ARN,
    secretArn=rds_config.SECRET_ARN,
    database=rds_config.DB_NAME,
    sql=add_supporter_rating_query,
    parameters=info)

#Mitch created this function for his other lambdas:
def param_to_sql_param(params, existing_sql_params=None):
    name_index = 0
    if existing_sql_params:
        name_index = len(existing_sql_params)

    sql_params = []
    for param in params:

        var_type = type(param)
        if var_type is str:
            value = {
                'stringValue': param
            }
        elif var_type is int:
            value = {
                'longValue': param
            }
        elif var_type is float:
            value = {
                'doubleValue': param
            }
        elif var_type is bool:
            value = {
                'booleanValue': param
            }
        elif var_type is list:
            value = {
                'arrayValue': {
                    'stringValues': param
                }
            }

        sql_params.append({
            'name': str(name_index),
            'value': value
        })
        name_index += 1

    if existing_sql_params:
        return existing_sql_params + sql_params
    return sql_params



