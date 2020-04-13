import json
import pymysql
import rds_config


#rds settings
rds_host  = rds_config.endpoint
name = rds_config.username
password = rds_config.password
db_name = rds_config.db_name


def remove_tag(tag_id):
    # should be error-checked
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)

    with conn.cursor() as curr:
        sql = "DELETE FROM `tags` WHERE `tag_id` = %s;"
        conn.execute(sql, [tag_id])

    '''
        # going to comment this out until we've decided on consistent  error handling
        # check that it was deleted
        sql = "SELECT `tag_name` FROM `tags` WHERE `tag_id`=%s"
        cursor.execute(sql, [tag_id])
        response = curr.fetchall()
    '''
    conn.close()
    return 200






def lambda_handler(event, context):

    # extract the tag id
    tag_id = int(event["pathParameters"]["id"])
    response = remove_tag(tag_id)

    '''
    # going to comment this out until we've decided on consistent  error handling
    if len(response) == 0:
        statusCode = 200
        message = "tag {} successfully dropped".format(tag_id)
    else:
        statusCode = 400
        message = "server error: tag {} was not dropped".format(tag_id)
    '''
    statusCode = response
    message = "tag {} successfully dropped".format(tag_id)
    
    return {
        'statusCode': statusCode,
        'body': {'message': message}
    }
