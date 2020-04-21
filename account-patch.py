import boto3
import json
import rds_config


# converts variables into boto3 SQL query input parameters. Also appends variables to existing SQL params if included
def param_to_sql_param(params, existing_sql_params=None):
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

        sql_params.append({
            'name': str(param),
            'value': value
        })
    if existing_sql_params:
        return existing_sql_params + sql_params
    return sql_params


def update_account(event, context):
    # identify user
    if 'user_id_' in event:
        user_id_ = event['user_id_']
    else:
        return {'statusCode': 400}

    client = boto3.client('rds-data')

    is_supporter = False
    # query to check if supporter or student
    supporter_exists_query = (f"SELECT * "
                              f"FROM supporter "
                              f"WHERE user_id_ = :{str(user_id_)};")

    supporter_exists_param = param_to_sql_param([user_id_])
    supporter_query_response = client.execute_statement(resourceArn=rds_config.ARN,
                                                        secretArn=rds_config.SECRET_ARN,
                                                        database=rds_config.DB_NAME,
                                                        sql=supporter_exists_query,
                                                        parameters=supporter_exists_param)
    if supporter_query_response["numberOfRecordsUpdated"] != 0:
        is_supporter = True

    is_student = False
    student_exists_query = (f"SELECT * "
                            f"FROM student "
                            f"WHERE user_id_ = :{str(user_id_)};")
    student_exists_param = param_to_sql_param([user_id_])
    student_query_response = client.execute_statement(resourceArn=rds_config.ARN,
                                                      secretArn=rds_config.SECRET_ARN,
                                                      database=rds_config.DB_NAME,
                                                      sql=student_exists_query,
                                                      parameters=student_exists_param)
    if supporter_query_response["numberOfRecordsUpdated"] != 0:
        is_student = True

    # account update info
    if 'email' in event:
        email = event['email']
    if 'password_' in event:
        password_ = event['password_']
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

    # student update info
    if is_student:
        if 'GPA' in event:
            gpa = event['GPA']
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

    # supporter update info
    if is_supporter:
        if 'title' in event:
            title = event['title']
        if 'current_employer' in event:
            current_employer = event['current_employer']
        if 'supporter_type' in event:
            supporter_type = event['supporter_type']
        if 'calendar_ref' in event:
            calendar_ref = event['calendar_ref']
        if 'calendar_sync' in event:
            calendar_sync = event['calendar_sync']
        if 'calendar_sync_freq' in event:
            calendar_sync_freq = event['calendar_sync_freq']

    if email:
        # verify email is not already in database
        already_exists_query = (f"SELECT * "
                                f"FROM user "
                                f"WHERE email = :{str(email)};")
        exists_param = param_to_sql_param([user_id_])
        exists_response = client.execute_statement(resourceArn=rds_config.ARN,
                                                   secretArn=rds_config.SECRET_ARN,
                                                   database=rds_config.DB_NAME,
                                                   sql=supporter_exists_query,
                                                   parameters=supporter_exists_param)
        if (exists_response.rowcount != 0):
            return {
                'statusCode': 204
            }

        query = (f"UPDATE user "
                 f"SET email = :{str(email)}; "
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([email, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            sql=query,
                                            parameters=params)

    if password_:
        query = (f"UPDATE user "
                 f"SET password_ = :{str(password_)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([password_, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if first_name:
        query = (f"UPDATE user "
                 f"SET first_name = :{str(first_name)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([first_name, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if last_name:
        query = (f"UPDATE user "
                 f"SET last_name = :{str(last_name)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([last_name, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if preferred_name:
        query = (f"UPDATE user "
                 f"SET preferred_name = :{str(preferred_name)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([preferred_name, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if phone_number:
        query = (f"UPDATE user "
                 f"SET phone_number = :{str(phone_number)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([phone_number, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if profile_picture:
        query = (f"UPDATE user "
                 f"SET profile_picture = :{str(profile_picture)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([profile_picture, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if request_supporter:
        query = (f"UPDATE user "
                 f"SET request_supporter = :{str(request_supporter)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([request_supporter, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if active_account:
        query = (f"UPDATE user "
                 f"SET active_account = :{str(active_account)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([active_account, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if gpa:
        query = (f"UPDATE student "
                 f"SET GPA = :{str(gpa)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([GPA, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if grad_year:
        query = (f"UPDATE student "
                 f"SET grad_year = :{str(grad_year)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([grad_year, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if resume_ref:
        query = (f"UPDATE student "
                 f"SET resume_ref = :{str(resume_ref)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([resume_ref, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if transcript_ref:
        query = (f"UPDATE student "
                 f"SET transcript_ref = :{str(transcript_ref)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([transcript_ref, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if github_link:
        query = (f"UPDATE student "
                 f"SET github_link = :{str(github_link)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([github_link, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database = rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if linkedin_link:
        query = (f"UPDATE student "
                 f"SET linkedin_link = :{str(linkedin_link)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([linkedin_link, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if is_undergrad:
        query = (f"UPDATE student "
                 f"SET is_undergrad = :{str(is_undergrad)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([is_undergrad, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if title:
        query = (f"UPDATE supporter "
                 f"SET title = :{str(title)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([title, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if current_employer:
        query = (f"UPDATE supporter "
                 f"SET current_employer = :{str(current_employer)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([current_employer, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if supporter_type:
        query = (f"UPDATE supporter "
                 f"SET supporter_type = :{str(supporter_type)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([supporter_type, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if calendar_ref:
        query = (f"UPDATE supporter "
                 f"SET calendar_ref = :{str(calendar_ref)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([calendar_ref, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if calendar_sync:
        query = (f"UPDATE supporter "
                 f"SET calendar_sync = :{str(calendar_sync)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([calendar_sync, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if calendar_sync_freq:
        query = (f"UPDATE supporter "
                 f"SET calendar_sync_freq = :{str(calendar_sync_freq)};"
                 f"WHERE user_id_ = :{str(user_id_)};")
        params = param_to_sql_param([calendar_sync_freq, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    return {
        'statusCode': 200
    }
