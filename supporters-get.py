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


    query = (
        "SELECT" 
            "T_suppU.user_id_, T_suppU.preffered_name, T_suppU.last_name, T_suppU.profile_picture, T_tags.tag_name, T_appt.appointment_name, T_suppType.supp_type"
        "FROM"
            "(SELECT supporter.user_id_, preffered_name, last_name, profile_picture"
            "FROM supporter INNER JOIN user on supporter.user_id_=user.user_id_)" 
            "as T_suppU,"
            "(SELECT supporter_tags.user_id_, supporter_tags.tag_id, tag_name"
            "FROM supporter_tags INNER JOIN tags ON supporter_tags.tag_id=tags.tag_id) "
            "as T_tags,"
            "(SELECT supp_appt.user_id_, supp_appt.type_id, appointment_name"
            "FROM supp_appt INNER JOIN appointment_type ON supp_apt.type_id=appointment_type.type_id) "
            "as T_appt,"
            "(SELECT supporter_type.user_id_, supporter_type.supp_type_id, supp_type"
            "FROM supporter_type INNER JOIN type_of_supporters ON supporter_type.supp_type_id=type_of_supporters.supp_type_id) "
            "as T_suppType"
        "WHERE"
            "T_suppU.user_id_=T_tags.user_id_ and T_suppU.user_id_=T_appt.user_id_ and T_suppU.user_id_=T_suppType.user_id_"
        "GROUP BY" 
            "T_suppU.user_id_"
    )

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
