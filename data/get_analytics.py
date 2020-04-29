import json
from db_wrapper import execute_statement, extract_records

# input: none
# output: json object with a csv string with the frequency of appointment types and 
#         a csv string with the frequency of tag types
def getAnalytics(event, context):
    
    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"

    # query db for the types of appts, their frequencies and the appt names
    query = "SELECT type_id, COUNT(type_id), AT.appointment_name \
            FROM appointments A NATURAL JOIN appointment_type AT \
            WHERE A.type_id = AT.type_id GROUP BY type_id;"
    appts_result = execute_statement(query)

    # query db for the tags and their frequencies and the tag names
    query = "SELECT ST.tag_id, COUNT(ST.tag_id), T.tag_name \
             FROM supporter_tags ST NATURAL JOIN tags T \
             WHERE ST.tag_id = T.tag_id \
             GROUP BY ST.tag_id;"
    tags_result = execute_statement(query)

    # no appt data and tag data in db
    if appts_result['records'] == [] and tags_result['records'] == []:
        return {
            'statusCode': 404,
            'body': json.dumps("No data found"),
            'headers': response_headers
        }
    
    appts_csv = "No appointment data"
    # there's appt data
    if appts_result['records'] != []:
        # build the appt csv string
        appts_csv = "Appointment type,Frequency"
        for tuple in appts_result['records']:
            appt_type = tuple[2].get("stringValue")
            frequency = tuple[1].get("longValue")
            appts_csv += "\n" + appt_type + "," + str(frequency)
    
    tags_csv = "No tag data"
    # there's tag data
    if tags_result['records'] != []:
        # build the tag csv string
        tags_csv = "Tag name,Frequency"
        for tuple in tags_result['records']:
            tag_name = tuple[2].get("stringValue")
            frequency = tuple[1].get("longValue")
            tags_csv += "\n" + tag_name + "," + str(frequency) 
    
    body = {}
    body["csv for appointments"] = appts_csv
    body["csv for tags"] = tags_csv
    
    return {
        'statusCode': 200,
        'body': json.dumps(body),
        'headers': response_headers
    }
