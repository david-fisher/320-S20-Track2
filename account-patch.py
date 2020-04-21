import boto3
import json
import rds_config


# converts variables into boto3 SQL query input parameters. Also appends variables to existing SQL params if included
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

        sql_params.append({
            'name': str(name_index),
            'value': value
        })
        name_index += 1

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
                              f"WHERE user_id_ = :{str(0)};")

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
                            f"WHERE user_id_ = :{str(0)};")
    student_exists_param = param_to_sql_param([user_id_])
    student_query_response = client.execute_statement(resourceArn=rds_config.ARN,
                                                      secretArn=rds_config.SECRET_ARN,
                                                      database=rds_config.DB_NAME,
                                                      sql=student_exists_query,
                                                      parameters=student_exists_param)
    if student_query_response["numberOfRecordsUpdated"] != 0:
        is_student = True

    # account update info
    email = password_ = first_name = last_name = preferred_name = phone_number \
        = profile_picture = request_supporter = active_account = None

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
    GPA = grad_year = resume_ref = transcript_ref = github_link = linkedin_link = is_undergrad = None

    if is_student:
        if 'GPA' in event:
            GPA = event['GPA']
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
    title = current_employer = supporter_type = calendar_ref = calendar_sync = calendar_sync_freq = None

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

    if email is not None:
        # verify email is not already in database
        already_exists_query = (f"SELECT * "
                                f"FROM user "
                                f"WHERE email = :{str(0)};")
        exists_param = param_to_sql_param([email])
        exists_response = client.execute_statement(resourceArn=rds_config.ARN,
                                                   secretArn=rds_config.SECRET_ARN,
                                                   database=rds_config.DB_NAME,
                                                   sql=already_exists_query,
                                                   parameters=exists_param)
        if exists_response["numberOfRecordsUpdated"] != 0:
            return {
                'statusCode': 204
            }

        query = (f"UPDATE user "
                 f"SET email = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([email, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if password_ is not None:
        query = (f"UPDATE user "
                 f"SET password_ = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([password_, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if first_name is not None:
        query = (f"UPDATE user "
                 f"SET first_name = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([first_name, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if last_name is not None:
        query = (f"UPDATE user "
                 f"SET last_name = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([last_name, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if preferred_name is not None:
        query = (f"UPDATE user "
                 f"SET preferred_name = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([preferred_name, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if phone_number is not None:
        query = (f"UPDATE user "
                 f"SET phone_number = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([phone_number, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if profile_picture is not None:
        query = (f"UPDATE user "
                 f"SET profile_picture = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([profile_picture, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if request_supporter is not None:
        query = (f"UPDATE user "
                 f"SET request_supporter = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([request_supporter, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if active_account is not None:
        query = (f"UPDATE user "
                 f"SET active_account = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([active_account, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if GPA is not None:
        query = (f"UPDATE student "
                 f"SET GPA = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([GPA, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if grad_year is not None:
        query = (f"UPDATE student "
                 f"SET grad_year = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([grad_year, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if resume_ref is not None:
        query = (f"UPDATE student "
                 f"SET resume_ref = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([resume_ref, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if transcript_ref is not None:
        query = (f"UPDATE student "
                 f"SET transcript_ref = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([transcript_ref, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if github_link is not None:
        query = (f"UPDATE student "
                 f"SET github_link = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([github_link, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database = rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if linkedin_link is not None:
        query = (f"UPDATE student "
                 f"SET linkedin_link = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([linkedin_link, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if is_undergrad is not None:
        query = (f"UPDATE student "
                 f"SET is_undergrad = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([is_undergrad, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if title is not None:
        query = (f"UPDATE supporter "
                 f"SET title = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([title, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if current_employer is not None:
        query = (f"UPDATE supporter "
                 f"SET current_employer = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([current_employer, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if supporter_type is not None:
        query = (f"UPDATE supporter "
                 f"SET supporter_type = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([supporter_type, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if calendar_ref is not None:
        query = (f"UPDATE supporter "
                 f"SET calendar_ref = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([calendar_ref, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if calendar_sync is not None:
        query = (f"UPDATE supporter "
                 f"SET calendar_sync = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([calendar_sync, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if calendar_sync_freq is not None:
        query = (f"UPDATE supporter "
                 f"SET calendar_sync_freq = :{str(0)} "
                 f"WHERE user_id_ = :{str(1)};")
        params = param_to_sql_param([calendar_sync_freq, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    return {
        'statusCode': 200
    }
