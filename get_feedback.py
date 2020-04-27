import boto3
import json
import rds_config

def supporter_feedback(event, context):
    if 'appointment_id' in event:
        appointment_id = event['appointment_id']
     
    get_feedback_rating_query= (f"SELECT * FROM student_feedback" 
    f"where appointment_id = :0;")

    info = param_to_sql_param([appointment_id])

    client = boto3.client('rds-data')

    response = client.execute_statement(resourceArn=rds_config.ARN,
    secretArn=rds_config.SECRET_ARN,
    database=rds_config.DB_NAME,
    sql=add_supporter_rating_query,
    parameters=info)

    return {
        'body': json.dumps(response),
        'statusCode': 200
    }

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



