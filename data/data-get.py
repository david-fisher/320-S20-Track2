import json
from db_wrapper import execute_statement, extract_records


# Returns the feedback settings for a given supporter id
def lambda_handler(event, context):
    
    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"
    
    try:
        # supp_id
        user_id_ = int(event["pathParameters"]["id"])
    except:
        return {
            'statusCode' : 400,
            'headers' : response_headers,
            'body' : json.dumps({'message' : 'Invalid user id input'})
        }
        
    # check supp exists
    query = "SELECT * FROM supporter WHERE user_id_ = :user_id_"
    sql_param = [ {'name': 'user_id_', 'value': {'longValue': user_id_}}]
    result = execute_statement(query, sql_param)
    
    if result['records'] == []:
        return {
            'statusCode' : 404,
            'headers' : response_headers,
            'body' : json.dumps({'message' : 'Supporter does not exist'})
        }
    
    response = []
        
    query = "SELECT * FROM supporter_questions WHERE user_id_ = :user_id_;"
    sql_param = [ {'name': 'user_id_', 'value': {'longValue': user_id_}}]
    result = execute_statement(query, sql_param)
    
    if result['records'] != []:
        questions = []
        for entry in result['records']:
            q_id = list(entry[0].values())[0]
            q = list(entry[2].values())[0]
            block = {
                'question_id': q_id,
                'question': q
            }
            questions.append(block)
        response.append(questions)
    else:
        response.append([])
        # response.append("No Questions")
    
    query = "SELECT show_feedback, rating, ask_recommended FROM feedback_settings WHERE user_id_ = :user_id_;"
    sql_param = [ {'name': 'user_id_', 'value': {'longValue': user_id_}}]
    result = execute_statement(query, sql_param)
    
    if result['records'] != []:
        for entry in result['records']:
            feedback = list(entry[0].values())[0]
            rating = list(entry[1].values())[0]
            rec = list(entry[2].values())[0]
        block = {
            "show_feedback": feedback,
            "rating": rating,
            "recommended": rec
        }
        response.append(block)
    else:
        response.append({})
          
    return{
        'body': json.dumps(response),
        'statusCode': 200,
        'headers': response_headers
    }