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
    query = "SELECT * FROM `supporter` WHERE `user_id_` = :id;"
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
