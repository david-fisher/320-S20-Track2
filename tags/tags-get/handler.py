import json
import pymysql
import rds_config


#rds settings
rds_host  = rds_config.endpoint
name = rds_config.username
password = rds_config.password
db_name = rds_config.db_name


def get_tags():
    # should be error-checked
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)

    try:
        with conn.cursor() as curr:
            sql = "SELECT * FROM tags;"
            conn.execute(sql)
            response = curr.fetchall()
            print(response)
    finally:
        conn.close()
    return response






def lambda_handler(event, context):
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps(get_tags())
    }
