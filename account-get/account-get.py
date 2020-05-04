import json
from db_wrapper import execute_statement, extract_records


def getUserInfo(id):

    #Database query for all users
    query = "SELECT * FROM `user` WHERE `user_id_` = :id;"
    sqlParameters = [{'name': "id", 'value':{'longValue': id}}]
    userQuery = execute_statement(query, sqlParameters)
    
    if userQuery['records'] == []:
        return []

    #Parse the result to prep for json.dumps
    response = extract_records(userQuery)

    #Get additional info depending on if user is student or supporter
    extraQuery = getStudentInfo(id) #Check if a student
    if extraQuery == []:
        extraQuery = getSupporterInfo(id)

    #Combine the two queries and return a response
    for record in extraQuery:
        response.append(record)
    return response

def getStudentInfo(id):

    #Database query for all users
    query = "SELECT * FROM `student` WHERE `user_id_` = :id;"
    sqlParameters = [{'name': "id", 'value':{'longValue': id}}]
    userQuery = execute_statement(query, sqlParameters)
    
    if userQuery['records'] == []:
        return []

    #Parse the result to prep for json.dumps
    response = extract_records(userQuery)

    return response

def getSupporterInfo(id):

    #Database query for all users
    query = "SELECT supporter.user_id_, title,current_employer, location calendar_ref, calendar_sync, calendar_sync_freq, supp_type_id  FROM supporter Left JOIN supporter_type on supporter_type.user_id_=supporter.user_id_ where supporter.user_id_= :id"
    sqlParameters = [{'name': "id", 'value':{'longValue': id}}]
    userQuery = execute_statement(query, sqlParameters)

    #Parse the result to prep for json.dumps
    response = extract_records(userQuery)
    
    availResponse = []
    feedResponse = []
    tagResponse = []
    supTypeResponse = []
    apptTypeResponse = []

    extraQuery = getAvailabilityInfo(id) #Check supporter's availability
    if extraQuery != []:
        for record in extraQuery:
            availResponse.append(record)
    response.append(availResponse)
    
    extraQuery = getFeedback(id) #Check supporter's feedback info
    if extraQuery != []:
        for record in extraQuery:
            feedResponse.append(record)
    response.append(feedResponse)

    extraQuery = getTags(id) #Check supporter's tags
    if extraQuery != []:
        for record in extraQuery:
            tagResponse.append(record)
    response.append(tagResponse)
    
    extraQuery = getSupporterTypes(id) #Check supporter's types
    if extraQuery != []:
        for record in extraQuery:
            supTypeResponse.append(record)
    response.append(supTypeResponse)

    extraQuery = getAppointmentTypes(id) #Check Appointment's types
    if extraQuery != []:
        for record in extraQuery:
            apptTypeResponse.append(record)
    response.append(apptTypeResponse)

    return response

def getAvailabilityInfo(id):

    #Database query for all users
    query = "SELECT * FROM `availability_supp` WHERE `user_id_` = :id;"
    sqlParameters = [{'name': "id", 'value':{'longValue': id}}]
    userQuery = execute_statement(query, sqlParameters)

    #Parse the result to prep for json.dumps
    response = extract_records(userQuery)
    
    return response

def getFeedback(id):

    #Database query for all users
    query = "SELECT Distinct student_feedback.appointment_id, appointment_name, rating, recommended FROM student_feedback, appointments, appointment_type where student_feedback.appointment_id = appointments.appointment_id and appointments.supporter_id = :id and appointments.type_id=appointment_type.type_id;;"
    sqlParameters = [{'name': "id", 'value':{'longValue': id}}]
    userQuery = execute_statement(query, sqlParameters)

    #Parse the result to prep for json.dumps
    response = extract_records(userQuery)
    
    return response
    
def getTags(id):

    #Database query for all users
    query = "SELECT Distinct tag_name FROM supporter_tags INNER JOIN tags ON supporter_tags.tag_id = tags.tag_id where user_id_= :id;"
    sqlParameters = [{'name': "id", 'value':{'longValue': id}}]
    userQuery = execute_statement(query, sqlParameters)

    #Parse the result to prep for json.dumps
    response = extract_records(userQuery)
    
    return response

def getSupporterTypes(id):

    #Database query for all users
    query = "SELECT Distinct supp_type FROM supporter_type INNER JOIN type_of_supporter ON supporter_type.supp_type_id = type_of_supporter.supp_type_id where user_id_= :id;"
    # query = "SELECT Distinct tag_name FROM supporter_tags INNER JOIN tags ON supporter_tags.tag_id = tags.tag_id where user_id_= :id;"
    
    sqlParameters = [{'name': "id", 'value':{'longValue': id}}]
    userQuery = execute_statement(query, sqlParameters)

    #Parse the result to prep for json.dumps
    response = extract_records(userQuery)
    
    return response
    

def getAppointmentTypes(id):

    #Database query for all users
    query = "SELECT Distinct appointment_name FROM appointment_type INNER JOIN supp_appt ON supp_appt.type_id = appointment_type.type_id where user_id_= :id;"
    sqlParameters = [{'name': "id", 'value':{'longValue': id}}]
    userQuery = execute_statement(query, sqlParameters)

    #Parse the result to prep for json.dumps
    response = extract_records(userQuery)
    
    return response


def lambda_handler(event, context):
    statusCode = 200
    responseHeaders = {}
    responseHeaders["X-Requested-With"] = "*"
    responseHeaders["Access-Control-Allow-Origin"] = "*"
    responseHeaders["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    responseHeaders["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"
    try:
       if not isinstance(int(event["pathParameters"]["id"]), int):
           return {
               'statusCode' : 400,
               'headers' : responseHeaders,
               'body' : "Input is not a valid id"
           }
    except:
        return {
            'statusCode' : 400,
            'headers' : responseHeaders,
            'body' : "No input"
        }
    id = int(event["pathParameters"]["id"])
    responseBody = getUserInfo(id)
    if(responseBody == []):
        return {
            'statusCode': 404,
            'headers' : responseHeaders,
            'body': "No user with associated user ID"
        }

    return {
        'statusCode': statusCode,
        'headers' : responseHeaders,
        'body': json.dumps(responseBody),
        'isBase64Encoded' : False
    }
