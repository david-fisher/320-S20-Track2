def get_appointments(email):
	app = query_the_database1(email)
	return app

def get_single_appointment(email, app_id):
	single_app = query_the_database2(email, app_id)
	return single_app
