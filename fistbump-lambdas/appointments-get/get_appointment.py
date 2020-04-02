import json
import boto3
import constants

def get_appointment(event,context):
    
    support_id = event['support_id'] #get id from json object
    #Connect to the User Database
    client = boto3.client('rds-data')
    print("Connecting to datavase")
    #Check if the user does not exist in the database
    supporter_appointment = client.execute_statement(
        secretArn = constants.SECRET_ARN, 
        database = constants.DB_NAME,
        resourceArn = constants.ARN,
        sql = "SELECT * FROM Supporter, Appointment WHERE supporter.pid = Appoinment.mid and supporter.id = '%s';" % (support_id) #schema maybe different
    )

    print("Checking if supporter has any appointments...")
    if(supporter_appointment['supporter_id'] == ''):
        print("User DNE")
        constants.ERR = "DNE"
        constants.STATUS_CODE = 404
        return
    #Return success
    else:
        print("Success")
        constants.list = json.dumps(sql)
        constants.STATUS_CODE = 200
        return
