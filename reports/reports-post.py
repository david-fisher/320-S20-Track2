import json
from db_wrapper import execute_statement, extract_records

def create_report(event, context):
    
    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"

    request_body = json.loads(event["body"])
    values = ["reporter_id_", "reported_id_", "report_reason", "report_date", "report_time"]

    # Check request body has all required values
    if not all (x in request_body for x in values):
        return {
            'statusCode': 400,
            'body': json.dumps('Invalid request body, need to contain all the following values: "reporter_id_", \
                                "reported_id_", "report_reason", "report_date", "report_time"'),
            'headers': response_headers
        }

    # Extract data from request body
    reporter_id_ = int(request_body["reporter_id_"])
    reported_id_ = int(request_body["reported_id_"])
    report_reason = request_body["report_reason"]
    report_date = request_body["report_date"]
    report_time = request_body["report_time"]

    # Check that the users exist
    query = "SELECT user_id_ FROM user WHERE user_id_ = :reporter_id_;"
    sql_params = [ {'name': 'reporter_id_', 'value':{'longValue': reporter_id_}} ]
    result = execute_statement(query)

    if result['records'] == []:
        return {
            'statusCode': 404,
            'body': json.dumps('reporter_id_ is not an existing user'),
            'headers': response_headers
        }
    
    query = "SELECT user_id_ FROM user WHERE user_id_ = :reported_id_;"
    sql_params = [ {'name': 'reported_id_', 'value':{'longValue': reported_id_}} ]
    result = execute_statement(query)

    if result['records'] == []:
        return {
            'statusCode': 404,
            'body': json.dumps('reported_id_ is not an existing user'),
            'headers': response_headers
        }


    # Insert the report into db
    query = "INSERT INTO reports VALUES(:reporter_id_, :reported_id_, :report_reason, :report_date, :report_time);"
    sql_params = [ {'name':'reporter_id_', 'value':{'longValue': reporter_id_}},
                   {'name':'reported_id_', 'value':{'longValue': reported_id_}},
                   {'name':'report_reason', 'value':{'stringValue': report_reason}}, 
                   {'name':'report_date', 'value':{'stringValue': report_date}},
                   {'name':'report_time', 'value':{'stringValue': report_time}}]
    result = execute_statement(query, sql_params)

    # Check that the db was updated
    if result['numberOfRecordsUpdated'] == 0:
        return {
            'statusCode': 500,
            'body': json.dumps('Database error creating report'),
            'headers': response_headers
        }

    # Success
    return {
        'statusCode': 201,
        'body': json.dumps('Successfully created the report'),
        'headers': response_headers
    }