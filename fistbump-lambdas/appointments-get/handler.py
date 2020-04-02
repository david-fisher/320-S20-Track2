import json

def parse_path(path):
	return path.split('/')

def get_appointments(email):
	app = query_the_database1(email)
	return app

def get_single_appointment(email, app_id):
	single_app = query_the_database2(email, app_id)
	return single_app

def lambda_handler(event, context):
    path = parse_path(event['path'])
	if len(path) == 3 and path[0] == 'supporters' and path[2] == 'appointments': #first helper call
		body = {list: get_appointments(path[1])}
	elif len(path) == 4 and path[0] == 'supporters' and path[2] == 'appointments': #second helper call
		body = {list: get_single_appointment(path[1], path[3])}
    return {
        'statusCode': 200,
        'body': body
    }
