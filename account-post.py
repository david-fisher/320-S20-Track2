import boto3
import json

from package import db_config


# generates a list for SQL of variables to be passed over separately e.g. "(%s, %s, %s, %s)"
def sql_list(length):
    param_list = "("
    for i in range(length):
        param_list += "%s, "
    return param_list[:-2] + ")"

# converts variables into boto3 SQL query input parameters. Also appends variables to existing SQL params if included
def param_to_sql_param(params, existing_sql_params=None):
    sql_params = []
    for param in params:
        sql_params.append({
            'value': param
        })
    if existing_sql_params:
        return existing_sql_params + sql_params
    return sql_params

def update_account(event, context):

    # identify filters
    if 'user_id_' in event:
        user_id_ = event['user_id_']
    else:
        return {'statusCode': 400}

    if 'email' in event:
        email = event['email']
    if 'password' in event:
        password = event['password']
    if 'first_name' in event:
        first_name = event['first_name']
    if 'last_name' in event:
        last_name = event['last_name']
    if 'preferred_name' in event:
        preferred_name = event['preferred_name']
    if 'phone_number' in event:
        phone_number = event['phone_number']
    if 'profile_picture' in event:
        profile_picture = event['profile_picture']
    if 'request_supporter' in event:
        request_supporter = event['request_supporter']
    if 'active_account' in event:
        active_account = event['active_account']
    if 'gpa' in event:
        gpa = event['gpa']
    if 'grad_year' in event:
        grad_year = event['grad_year']
    if 'resume_ref' in event:
        resume_ref = event['resume_ref']
    if 'transcript_ref' in event:
        transcript_ref = event['transcript_ref']
    if 'github_link' in event:
        github_link = event['github_link']
    if 'linkedin_link' in event:
        linkedin_link = event['linkedin_link']
    if 'is_undergrad' in event:
        is_undergrad = event['is_undergrad']

    # make sure account is valid
    user_exists_query = ""

    # access client and execute query
    client = boto3.client('rds-data')


    return{
        'body': json.dumps(response),
        'statusCode': 200
    }
