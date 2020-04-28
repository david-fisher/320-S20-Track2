import json
from db_wrapper import execute_statement, extract_records

# input: none
# output: an array of arrays containing all the reports
def get_reports(event, context):
    
    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"
    
    # query db for all the reports
    query = "SELECT * FROM reports;"
    result = execute_statement(query)

    if result['records'] == []:
        return{
            'statusCode': 404,
            'body': json.dumps("No reports found"),
            'headers': response_headers
        }
    
    # parse the response
    response_body = extract_records(result)
    
    return {
        'statusCode': 200,
        'body': json.dumps(response_body),
        'headers': response_headers
    }
