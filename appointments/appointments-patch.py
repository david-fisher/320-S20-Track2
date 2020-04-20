import json
from db_wrapper import execute_statement, extract_records

# Cancels the appt by setting the 'cancelled' boolean in the db to true
# Input: appointment_id
# Output: 200 for success, 404 if appt id not found in db, 500 if error cancelling appt
def cancel_appt(event, context):
    # Extract the appt id to delete
    appt_id = int(event['pathParameters']['id'])

    # Check if the appt id exists in database
    query = "SELECT `appointment_id` FROM `appointments` WHERE `appointment_id` = :appt_id;"
    sql_params = [{'name': 'appt_id', 'value':{'longValue': appt_id}}]
    existing_appt = execute_statement(query, sql_params)
    
    # Appt id not found
    if existing_appt['records'] == []:
        return {
            'statusCode': 404,
            'body': json.dumps('Appointment id not found in database')
        }

    # Cancel the appt
    query = "UPDATE `appointments` SET `cancelled` = true WHERE `appointment_id` = :appt_id;"
    query_response = execute_statement(query, sql_params)

    # If the database does not update the appt to cancelled
    if query_response['numberOfRecordsUpdated'] == 0:
        return {
            'statusCode': 500,
            'body': json.dumps('Error in cancelling the appointment')
        }

    # Return success 
    return {
        'statusCode': 200,
        'body': json.dumps('Successfully cancelled appointment')
    }