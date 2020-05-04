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


def update_account(event, context):

    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers[
        "Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE,PATCH"

    # identify user
    try:
        if not isinstance(int(event["pathParameters"]["id"]), int):
            return {
                'statusCode': 404,
                'headers': response_headers,
                'body': "Input is not a valid id"
            }
    except:
        return {
            'statusCode': 404,
            'headers': response_headers,
            'body': "User ID Input Error"
    }

    user_id_ = ""
    try:
        user_id_ = int(event["pathParameters"]["id"])
    except:
        return {
            'statusCode': 404,
            'headers': response_headers,
            'body': "Unable to parse User ID"
        }

    client = boto3.client('rds-data')

    # verify user exists
    user_exists_query = (f"SELECT * "
                         f"FROM user "
                         f"WHERE user_id_ = :0;")

    user_exists_param = param_to_sql_param([user_id_])
    user_query_response = client.execute_statement(resourceArn=rds_config.ARN,
                                                   secretArn=rds_config.SECRET_ARN,
                                                   database=rds_config.DB_NAME,
                                                   sql=user_exists_query,
                                                   parameters=user_exists_param)
    if user_query_response['records'] == []:
        return {
            'statusCode': 404,
            'headers': response_headers,
            'body': "User does not exist"
        }


    is_supporter = False
    # query to check if supporter or student
    supporter_exists_query = (f"SELECT * "
                              f"FROM supporter "
                              f"WHERE user_id_ = :0;")

    supporter_exists_param = param_to_sql_param([user_id_])
    supporter_query_response = client.execute_statement(resourceArn=rds_config.ARN,
                                                        secretArn=rds_config.SECRET_ARN,
                                                        database=rds_config.DB_NAME,
                                                        sql=supporter_exists_query,
                                                        parameters=supporter_exists_param)
    if supporter_query_response['records'] != []:
        is_supporter = True

    is_student = False
    student_exists_query = (f"SELECT * "
                            f"FROM student "
                            f"WHERE user_id_ = :0;")
    student_exists_param = param_to_sql_param([user_id_])
    student_query_response = client.execute_statement(resourceArn=rds_config.ARN,
                                                      secretArn=rds_config.SECRET_ARN,
                                                      database=rds_config.DB_NAME,
                                                      sql=student_exists_query,
                                                      parameters=student_exists_param)
    if student_query_response['records'] != []:
        is_student = True

    # account update info
    email = password_ = first_name = last_name = preferred_name = phone_number \
        = profile_picture = request_supporter = active_account = description \
        = pronouns = None

    if 'email' in event['body']:
        email = json.loads(event['body'])['email']
    if 'password_' in event['body']:
        password_ = json.loads(event['body'])['password_']
    if 'first_name' in event['body']:
        first_name = json.loads(event['body'])['first_name']
    if 'last_name' in event['body']:
        last_name = json.loads(event['body'])['last_name']
    if 'preferred_name' in event['body']:
        preferred_name = json.loads(event['body'])['preferred_name']
    if 'phone_number' in event['body']:
        phone_number = json.loads(event['body'])['phone_number']
    if 'profile_picture' in event['body']:
        profile_picture = json.loads(event['body'])['profile_picture']
    if 'request_supporter' in event['body']:
        request_supporter = json.loads(event['body'])['request_supporter']
    if 'active_account' in event['body']:
        active_account = json.loads(event['body'])['active_account']
    if 'description' in event['body']:
        description = json.loads(event['body'])['description']
    if 'pronouns' in event['body']:
        pronouns = json.loads(event['body'])['pronouns']

    # student update info
    GPA = grad_year = resume_ref = transcript_ref = github_link = linkedin_link \
        = is_undergrad = college = program = job_search = work_auth = None

    if is_student:
        if 'GPA' in event['body']:
            GPA = json.loads(event['body'])['GPA']
        if 'grad_year' in event['body']:
            grad_year = json.loads(event['body'])['grad_year']
        if 'resume_ref' in event['body']:
            resume_ref = json.loads(event['body'])['resume_ref']
        if 'transcript_ref' in event['body']:
            transcript_ref = json.loads(event['body'])['transcript_ref']
        if 'github_link' in event['body']:
            github_link = json.loads(event['body'])['github_link']
        if 'linkedin_link' in event['body']:
            linkedin_link = json.loads(event['body'])['linkedin_link']
        if 'is_undergrad' in event['body']:
            is_undergrad = json.loads(event['body'])['is_undergrad']
        if 'college' in event['body']:
            college = json.loads(event['body'])['college']
        if 'program' in event['body']:
            program = json.loads(event['body'])['program']
        if 'job_search' in event['body']:
            job_search = json.loads(event['body'])['job_search']
        if 'work_auth' in event['body']:
            work_auth = json.loads(event['body'])['work_auth']


    # supporter update info
    title = current_employer = supporter_type = calendar_ref = location = calendar_sync = calendar_sync_freq = None

    if is_supporter:
        if 'title' in event['body']:
            title = json.loads(event['body'])['title']
        if 'current_employer' in event['body']:
            current_employer = json.loads(event['body'])['current_employer']
        if 'supporter_type' in event['body']:
            supporter_type = json.loads(event['body'])['supporter_type']
        if 'calendar_ref' in event['body']:
            calendar_ref = json.loads(event['body'])['calendar_ref']
        if 'calendar_sync' in event['body']:
            calendar_sync = json.loads(event['body'])['calendar_sync']
        if 'calendar_sync_freq' in event['body']:
            calendar_sync_freq = json.loads(event['body'])['calendar_sync_freq']
        if 'location' in event['body']:
            location = json.loads(event['body'])['location']

    availability_add = availability_delete = supporter_type_add = supporter_type_delete = \
        appointment_add = appointment_delete = tags_add = tags_delete = None

    if is_supporter:
        if 'availability_add' in event['body']:
            availability_add = json.loads(event['body'])['availability_add']
        if 'availability_delete' in event['body']:
            availability_delete = json.loads(event['body'])['availability_delete']
        if 'supporter_type_add' in event['body']:
            supporter_type_add = json.loads(event['body'])['supporter_type_add']
        if 'supporter_type_delete' in event['body']:
            supporter_type_delete = json.loads(event['body'])['supporter_type_delete']
        if 'appointment_add' in event['body']:
            appointment_add = json.loads(event['body'])['appointment_add']
        if 'appointment_delete' in event['body']:
            appointment_delete = json.loads(event['body'])['appointment_delete']
        if 'tags_add' in event['body']:
            tags_add = json.loads(event['body'])['tags_add']
        if 'tags_delete' in event['body']:
            tags_delete = json.loads(event['body'])['tags_delete']


    show_feedback = rating = ask_recommended = None

    if is_supporter:
        if 'show_feedback' in event['body']:
            show_feedback = json.loads(event['body'])['show_feedback']
        if 'rating' in event['body']:
            rating = json.loads(event['body'])['rating']
        if 'ask_recommended' in event['body']:
            ask_recommended = json.loads(event['body'])['ask_recommended']

    question = question_id = None

    if is_supporter:
        if 'question' in event['body']:
            question = json.loads(event['body'])['question']
        if 'question_id' in event['body']:
            question_id = json.loads(event['body'])['question_id']

    type_id = length_ = None

    if is_supporter:
        if 'type_id' in event['body']:
            type_id = json.loads(event['body'])['type_id']
        if 'length_' in event['body']:
            length_ = json.loads(event['body'])['length_']


    if email is not None:
        # verify email is not already in database
        already_exists_query = (f"SELECT * "
                                f"FROM user "
                                f"WHERE email = :0;")
        exists_param = param_to_sql_param([email])
        exists_response = client.execute_statement(resourceArn=rds_config.ARN,
                                                   secretArn=rds_config.SECRET_ARN,
                                                   database=rds_config.DB_NAME,
                                                   sql=already_exists_query,
                                                   parameters=exists_param)
        if exists_response['records'] != []:
            return {
                'statusCode': 204,
                'headers': response_headers,
                'body': "Email already registered under different user"
            }

        query = (f"UPDATE user "
                 f"SET email = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([email, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if password_ is not None:
        query = (f"UPDATE user "
                 f"SET password_ = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([password_, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if first_name is not None:
        query = (f"UPDATE user "
                 f"SET first_name = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([first_name, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if last_name is not None:
        query = (f"UPDATE user "
                 f"SET last_name = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([last_name, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if preferred_name is not None:
        query = (f"UPDATE user "
                 f"SET preferred_name = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([preferred_name, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if phone_number is not None:
        query = (f"UPDATE user "
                 f"SET phone_number = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([phone_number, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if profile_picture is not None:
        query = (f"UPDATE user "
                 f"SET profile_picture = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([profile_picture, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if request_supporter is not None:
        query = (f"UPDATE user "
                 f"SET request_supporter = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([request_supporter, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if active_account is not None:
        query = (f"UPDATE user "
                 f"SET active_account = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([active_account, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if description is not None:
        query = (f"UPDATE user "
                 f"SET description = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([description, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if pronouns is not None:
        query = (f"UPDATE user "
                 f"SET pronouns = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([pronouns, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if GPA is not None:
        query = (f"UPDATE student "
                 f"SET GPA = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([GPA, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if grad_year is not None:
        query = (f"UPDATE student "
                 f"SET grad_year = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([grad_year, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if resume_ref is not None:
        query = (f"UPDATE student "
                 f"SET resume_ref = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([resume_ref, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if transcript_ref is not None:
        query = (f"UPDATE student "
                 f"SET transcript_ref = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([transcript_ref, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if github_link is not None:
        query = (f"UPDATE student "
                 f"SET github_link = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([github_link, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database = rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if linkedin_link is not None:
        query = (f"UPDATE student "
                 f"SET linkedin_link = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([linkedin_link, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if is_undergrad is not None:
        query = (f"UPDATE student "
                 f"SET is_undergrad = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([is_undergrad, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if college is not None:
        query = (f"UPDATE student "
                 f"SET college = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([college, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if program is not None:
        query = (f"UPDATE student "
                 f"SET program = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([program, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if job_search is not None:
        query = (f"UPDATE student "
                 f"SET job_search = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([job_search, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if work_auth is not None:
        query = (f"UPDATE student "
                 f"SET work_auth = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([work_auth, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if title is not None:
        query = (f"UPDATE supporter "
                 f"SET title = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([title, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if current_employer is not None:
        query = (f"UPDATE supporter "
                 f"SET current_employer = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([current_employer, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if supporter_type is not None:
        query = (f"UPDATE supporter "
                 f"SET supporter_type = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([supporter_type, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)
    if calendar_ref is not None:
        query = (f"UPDATE supporter "
                 f"SET calendar_ref = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([calendar_ref, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if calendar_sync is not None:
        query = (f"UPDATE supporter "
                 f"SET calendar_sync = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([calendar_sync, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if calendar_sync_freq is not None:
        query = (f"UPDATE supporter "
                 f"SET calendar_sync_freq = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([calendar_sync_freq, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)


    if location is not None:
        query = (f"UPDATE supporter "
                 f"SET location = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([location, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    # Supporter Appointment Stuff

    if availability_add is not None:
        for appointment in availability_add:

            start_time = appointment['start_time']
            end_time = appointment['end_time']
            appt_date = appointment['appt_date']

            query = ("INSERT INTO availability_supp "
                     "VALUES (:0, :1, :2, :3);")
            params = param_to_sql_param([user_id_, start_time, end_time, appt_date])
            response = client.execute_statement(resourceArn=rds_config.ARN,
                                                secretArn=rds_config.SECRET_ARN,
                                                database=rds_config.DB_NAME,
                                                sql=query,
                                                parameters=params)

    if availability_delete is not None:
        for appointment in availability_delete:

            start_time = appointment['start_time']
            end_time = appointment['end_time']
            appt_date = appointment['appt_date']

            query = ("DELETE FROM availability_supp "
                     "WHERE user_id_ = :0 "
                     "AND start_time = :1 "
                     "AND end_time = :2 "
                     "AND appt_date = :3;")
            params = param_to_sql_param([user_id_, start_time, end_time, appt_date])
            response = client.execute_statement(resourceArn=rds_config.ARN,
                                                secretArn=rds_config.SECRET_ARN,
                                                database=rds_config.DB_NAME,
                                                sql=query,
                                                parameters=params)

    if supporter_type_add is not None:
        for supporter_type in supporter_type_add:

            supp_type_id = supporter_type['supp_type_id']

            query = ("INSERT INTO supporter_type "
                     "VALUES (:0, :1);")
            params = param_to_sql_param([user_id_, supp_type_id])
            response = client.execute_statement(resourceArn=rds_config.ARN,
                                                secretArn=rds_config.SECRET_ARN,
                                                database=rds_config.DB_NAME,
                                                sql=query,
                                                parameters=params)

    if supporter_type_delete is not None:
        for supporter_type in supporter_type_delete:

            supp_type_id = supporter_type['supp_type_id']

            query = ("DELETE FROM supporter_type "
                     "WHERE user_id_ = :0 "
                     "AND supp_type_id = :1;")
            params = param_to_sql_param([user_id_, supp_type_id])
            response = client.execute_statement(resourceArn=rds_config.ARN,
                                                secretArn=rds_config.SECRET_ARN,
                                                database=rds_config.DB_NAME,
                                                sql=query,
                                                parameters=params)

    if appointment_add is not None:
        for appointment in appointment_add:

            appt_type_id = appointment['type_id']

            query = ("INSERT INTO supp_appt "
                     "VALUES (:0, :1);")
            params = param_to_sql_param([user_id_, appt_type_id])
            response = client.execute_statement(resourceArn=rds_config.ARN,
                                                secretArn=rds_config.SECRET_ARN,
                                                database=rds_config.DB_NAME,
                                                sql=query,
                                                parameters=params)

    if appointment_delete is not None:
        for appointment in appointment_delete:

            appt_type_id = appointment['type_id']

            query = ("DELETE FROM supp_appt "
                     "WHERE user_id_ = :0 "
                     "AND type_id = :1;")
            params = param_to_sql_param([user_id_, appt_type_id])
            response = client.execute_statement(resourceArn=rds_config.ARN,
                                                secretArn=rds_config.SECRET_ARN,
                                                database=rds_config.DB_NAME,
                                                sql=query,
                                                parameters=params)

    if tags_add is not None:
        for tag in tags_add:

            tag_id = tag['tag_id']

            query = ("INSERT INTO supporter_tags "
                     "VALUES (:0, :1);")
            params = param_to_sql_param([user_id_, tag_id])
            response = client.execute_statement(resourceArn=rds_config.ARN,
                                                secretArn=rds_config.SECRET_ARN,
                                                database=rds_config.DB_NAME,
                                                sql=query,
                                                parameters=params)

    if tags_delete is not None:
        for tag in tags_delete:

            tag_id = tag['tag_id']

            query = ("DELETE FROM supporter_tags "
                     "WHERE user_id_ = :0 "
                     "AND tag_id = :1;")
            params = param_to_sql_param([user_id_, tag_id])
            response = client.execute_statement(resourceArn=rds_config.ARN,
                                                secretArn=rds_config.SECRET_ARN,
                                                database=rds_config.DB_NAME,
                                                sql=query,
                                                parameters=params)


    if show_feedback is not None:
        query = (f"UPDATE feedback_settings "
                 f"SET show_feedback = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([show_feedback, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if rating is not None:
        query = (f"UPDATE feedback_settings "
                 f"SET rating = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([rating, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if ask_recommended is not None:
        query = (f"UPDATE feedback_settings "
                 f"SET ask_recommended = :0 "
                 f"WHERE user_id_ = :1;")
        params = param_to_sql_param([ask_recommended, user_id_])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if type_id is not None and length_ is not None:
        query = (f"UPDATE appointment_settings "
                 f"SET length_ = :0 "
                 f"WHERE user_id_ = :1 "
                 f"AND type_id = :2;")
        params = param_to_sql_param([length_, user_id_, type_id])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    if question_id is not None and question is not None:
        query = (f"UPDATE supporter_questions "
                 f"SET question = :0 "
                 f"WHERE user_id_ = :1 "
                 f"AND question_id = :2;")
        params = param_to_sql_param([question, user_id_, question_id])
        response = client.execute_statement(resourceArn=rds_config.ARN,
                                            secretArn=rds_config.SECRET_ARN,
                                            database=rds_config.DB_NAME,
                                            sql=query,
                                            parameters=params)

    return {
        'statusCode': 200,
        'body': json.dumps('Account successfully updated'),
        'headers': response_headers
    }