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
        # delete the tag from tags table
        sql = "DELETE FROM `tags` WHERE `tag_id` = %s;"
        conn.execute(sql, [tag_id])

        # remove supporter associations
        sql = "DELETE FROM `supporter_tags` WHERE `tag_id` = %s;"
        conn.execute(sql, [tag_id])

    conn.commit()
    conn.close()
    return 200






def lambda_handler(event, context):

    # extract the tag id
    tag_id = int(event["pathParameters"]["id"])
    response = remove_tag(tag_id)

    statusCode = response
    message = "tag {} successfully dropped".format(tag_id)

    return {
        'statusCode': statusCode,
        'body': {'message': message}
    }
