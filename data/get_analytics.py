import json
from db_wrapper import execute_statement, extract_records

# input: none
# output: json object with a csv as an array of arrays with the frequency of appointment types and 
#         a csv as an array of arrays with the frequency of tag types
def getAnalytics(event, context):
    
    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"

    # query db for the types of appts, their frequencies and the appt names
    query = "SELECT AT.type_id, COUNT(A.type_id), AT.appointment_name \
            FROM appointments AS A RIGHT JOIN appointment_type AS AT \
            ON A.type_id = AT.type_id \
            WHERE active_type = true \
            GROUP BY AT.type_id;"
    appts_result = execute_statement(query)

    # query db for the tags and their frequencies and the tag names
    query = "SELECT T.tag_id, COUNT(ST.tag_id), T.tag_name \
             FROM supporter_tags AS ST RIGHT JOIN tags T \
             ON ST.tag_id = T.tag_id \
             GROUP BY T.tag_id;"
    tags_result = execute_statement(query)

    appts_csv = "No appointment data"
    # there's appt data
    if appts_result['records'] != []:
        # build the appt csv 
        appts_csv = [["Appointment type", "Frequency"]]
        for tuple in appts_result['records']:
            appt_type = tuple[2].get("stringValue")
            frequency = tuple[1].get("longValue")
            appts_csv.append([appt_type, frequency])
    
    tags_csv = "No tag data"
    # there's tag data
    if tags_result['records'] != []:
        # build the tag csv 
        tags_csv = [["Tag name", "Frequency"]]
        for tuple in tags_result['records']:
            tag_name = tuple[2].get("stringValue")
            frequency = tuple[1].get("longValue")
            tags_csv.append([tag_name, frequency])
    
    body = {}
    body["csv for appointments"] = appts_csv
    body["csv for tags"] = tags_csv
    
    return {
        'statusCode': 200,
        'body': json.dumps(body),
        'headers': response_headers
    }
