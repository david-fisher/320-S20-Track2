import json
from db_wrapper import execute_statement, extract_records

# input: none
# output: a csv string with the frequency of appointment types
def getAnalytics(event, context):
    
    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"

    # query db for the types of appts and their frequencies
    query = "SELECT DISTINCT type_id, COUNT(type_id) FROM appointments GROUP BY type_id;"
    appt_freqs = execute_statement(query)
    
    # no appt data in db
    if appt_freqs['records'] == []:
        return {
            'statusCode': 404,
            'body': json.dumps("No data found"),
            'headers': response_headers
        }
    
    # query db for the name of the types of appts
    query = "SELECT * FROM appointment_type;"
    result = execute_statement(query)
    
    # extract the data from the query to make it easier to handle
    type_names = {}
    for tuple in result['records']:
        key = tuple[0].get("longValue")
        value = tuple[1].get("stringValue")
        type_names[key] = value
    
    # Build the csv string
    csv = "Appointment type,Frequency"
    for tuple in appt_freqs['records']:
        type_id = tuple[0].get("longValue")
        frequency = tuple[1].get("longValue")
        csv += "\n" + type_names.get(type_id) + "," + str(frequency)
    
    body = {}
    body["csv"] = csv
    
    return {
        'statusCode': 200,
        'body': json.dumps(csv),
        'headers': response_headers
    }
