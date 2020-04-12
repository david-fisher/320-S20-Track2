import boto3
import json

from package import db_config


def get_filtered_supporters(event, context):

    # identify filters
    if 'titles' in event:
        titles = event['titles']
    if 'current_employers' in event:
        current_employers = event['current_employers']
    if 'supporter_types' in event:
        supporter_types = event['supporter_types']
    if 'tags' in event:
        tags = event['tags']

    # build query
    query = ""
    if titles:
        query += "title IN (" + str(titles)[1:-1] + ") AND "
    if current_employers:
        query += "current_employer IN (" + str(current_employers)[1:-1] + ") AND "
    if supporter_types:
        query += "supporter_type IN (" + str(supporter_types)[1:-1] + ") AND "

    # finish query
    if query == "":
        query = ("SELECT * "
                 "FROM supporter;")
    else:
        # remove unwanted "AND " sequence at end of query
        query = query[:-4]
        query = ("SELECT * "
                 "FROM supporter "
                 "WHERE " + query + ";")

    # TODO: Filter by tags, sort out the tag system

    # access client and execute query
    client = boto3.client('rds-data')

    response = client.execute_statement(resourceArn=db_config.ARN,
                                        secretArn=db_config.SECRET_ARN,
                                        sql=query)

    return{
        'body': json.dumps(response),
        'statusCode': 200
    }
