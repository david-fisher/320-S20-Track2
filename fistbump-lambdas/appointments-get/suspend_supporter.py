import json
import boto3
import constants

def event_handler(event,context):    
    client = boto3.client('rds-data')
    if 'supporter_id' in event:
        supporter_id = event['supporter_id']


    id_query = (f"Update supporter "
                f"Set restriction = True"
                f"WHERE supporterid = {supporter_id}")

    client = boto3.client('rds-data')

    supporter_restricted = client.commmit_transaction(resourceArn=db_config.ARN,
                                                   database = constants.DB_NAME,
                                                   secretArn=db_config.SECRET_ARN,
                                                   sql=id_query)             
                
    if supporter_restricted.transactionStatus != '200':
        print("Supporter not exist")
        constants.ERR = "DNE"
        constants.STATUS_CODE = 404
        return

    else:
        print("Success")
        constants.STATUS_CODE = 200
        return