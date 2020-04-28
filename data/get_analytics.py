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

    # query db for the types of appts, their frequencies and the appt names
    query = "SELECT type_id, COUNT(type_id), AT.appointment_name \
            FROM appointments A NATURAL JOIN appointment_type AT \
            WHERE A.type_id = AT.type_id GROUP BY type_id"
    result = execute_statement(query)

    # no appt data in db
    if result['records'] == []:
        return {
            'statusCode': 404,
            'body': json.dumps("No data found"),
            'headers': response_headers
        }
    
    # build the csv string
    csv = "Appointment type,Frequency"
    for tuple in result['records']:
        appt_type = tuple[2].get("stringValue")
        frequency = tuple[1].get("longValue")
        csv += "\n" + appt_type + "," + str(frequency)
    
    body = {}
    body["csv"] = csv
    
    return {
        'statusCode': 200,
        'body': json.dumps(csv),
        'headers': response_headers
    }
