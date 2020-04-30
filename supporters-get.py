import boto3
import json
import rds_config

def get_supporters(event, context):

    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers[
        "Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE,PATCH"


    query = ("SELECT user_id_, title, current_employer, location "
             "FROM supporter "
             "UNION SELECT email, first_name, last_name, preferred_name, profile_picture, request_supporter "
             "FROM user "
             "WHERE supporter.user_id_ = user.user_id_")

    # access client and execute query
    client = boto3.client('rds-data')

    response = client.execute_statement(resourceArn=rds_config.ARN,
                                        secretArn=rds_config.SECRET_ARN,
                                        database=rds_config.DB_NAME,
                                        sql=query)

    return{
        'body': json.dumps(response),
        'headers': response_headers
        'statusCode': 200
    }
