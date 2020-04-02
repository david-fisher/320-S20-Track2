import boto3


'''
Queries the database for entries from a table matching every parameter
    table:      A string of the database table to query
    fields:     A string of the different fields to retrieve, separated by commas.
    conditions: A dictionary with {field : value} pairs for each parameter to select records with.
                If the value is None, we select all records instead

    returrns: the database rresponse from the query

    current issues:
        1) We don't have an Aurora instance set up so we have no idea if this works
        2) We need a constants module that's in the gitignore to add our constants in safely
        3) Usining parameterized queries uses types as keys, and I haven't handled that yet
'''
def basic_select(table, fields='*', conditions=None):
    client = boto3.client('rds-data')
    query = "SELECT {} FROM {}"

    if (conditions is None):
        response = client.execute_statement({"resourceArn": "placeholder", "secretArn": "placeholder", "sql": query})
        return response

    # this is definitely inelegant but my python isn't great rn
    query.join(" WHERE")
    cond_list = conditions.list()
    params = []
    i = 0
    for key, value in cond_list:
        key_param = { "name": str(i).join(":"), "value": {"stringValue": str(key)} }
        params.append(key_param)
        query.join(" :").join(i).join("=")
        i += 1

        value_param = { "name": str(i).join(":"), "value": {"stringValue": str(value)} }
        params.append(value_param)
        query.join(":").join(i)
        i += 1
    response = client.execute_statement({"parameters" : params, "resourceArn": "placeholder", "secretArn": "placeholder", "sql": query})
    return response
