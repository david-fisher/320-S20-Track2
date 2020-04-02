import json
import boto3
import constants

def get_appointment(event,context):
    
    support_id = event['support_id'] #get id from json object
    #Connect to the User Database
    client = boto3.client('rds-data')
    print("Connecting to database")
    #Check if the user does not exist in the database
    existing_supporter = client.execute_statement(
        secretArn = constants.SECRET_ARN, 
        database = constants.DB_NAME,
        resourceArn = constants.ARN,
        sql = "SELECT rating FROM Supporter WHERE supporter.id = '%s';" % (support_id) #schema maybe different
    )

    print("Checking if supporter exist..")
    if(existing_supporter['supporter_id'] == ''):
        print("supporter DNE")
        constants.ERR = "DNE"
        constants.STATUS_CODE = 404
        return
    #Return success
    else:
        print("Success")
        constants.RATING = json.dumps(sql)
        constants.STATUS_CODE = 200
        return
