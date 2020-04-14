import json
import pymysql
import rds_config


#rds settings
rds_host  = rds_config.endpoint
name = rds_config.username
password = rds_config.password
db_name = rds_config.db_name


def put_tag(tag_name):
    # should be error-checked
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)

    with conn.cursor() as curr:
        #generate the next id number
        sql = "SELECT MAX(tag_id) FROM tags;"
        conn.execute(sql)
        response = curr.fetchone()
        tag_id = response + 1

        sql = "INSERT INTO tags VALUES (%s, %s);"
        conn.execute(sql, [tag_id, tag_name])

    conn.commit()
    conn.close()
    return 200






def lambda_handler(event, context):

    # extract the tag_name
    tag_name = event["body"]["tag_name"]
    tag_id = int(event["body"]["tag_name"])

    response = put_tag(tag_name)

    statusCode = response
    message = "tag {} successfully dropped".format(tag_id)

    return {
        'statusCode': statusCode,
        'body': {'message' : message}
    }
