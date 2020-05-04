import boto3
import json
import rds_config
from HelperFunctions import funct1

def get_supporters(event, context):
    
    response_headers = {}
    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers[
        "Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE,PATCH"
    
    #information returned for each supporter
    
    #Part1: Table "user"
    # user_id_
    # email
    # first_name
    # preferred_name
    # last name
    # profile pic
    
    #Part2: Table "supporter"
    # title
    # current employer
    
    #Part3: Table "----"
    # tags
    
    #Part4: Table "----"
    #type of appointments
    
    #supporter type(s)
    
    #availabilty
    
    #rating
    
    # access client
    client = boto3.client('rds-data')
    # Make a dictionary with supporter user_id as key
    supporterDict={}
    #query to retrieve user_id, title, current_employer from all registered supporters
    query=(
        "SELECT " 
        "user_id_ , title, current_employer "
        "FROM "
        "supporter"
    )
    #execute query
    response = client.execute_statement(secretArn=rds_config.SECRET_ARN,
                                        database=rds_config.DB_NAME,
                                        resourceArn=rds_config.ARN,
                                        sql=query)
                                        
    for record in response["records"]:
        # list(field.values())[0]
        user_id = list(record[0].values())[0]
        title = list(record[1].values())[0]
        current_employer = list(record[2].values())[0]
        if user_id not in supporterDict:
            supporterDict[user_id]={
                "title":title,
                "current_employer":current_employer
            }
        else:
            return{
                'body': "Duplicate user_id in SUPPORTER table",
                'headers': response_headers,
                'statusCode': 400
            }
    
    # The supporterDict is now filled with user_ids that map to title and current employer
    # Next we will query the user table to retrieve the email, first_name, preferred_name, last name, profile pic for all suporters. Then we will put that information into the supporterDict

    query=(
        "SELECT " 
        "user_id_ , email, first_name, last_name, preferred_name, profile_picture, request_supporter "
        "FROM "
        "user"
    )
    #execute query
    response = client.execute_statement(secretArn=rds_config.SECRET_ARN,
                                        database=rds_config.DB_NAME,
                                        resourceArn=rds_config.ARN,
                                        sql=query)
    for record in response["records"]:
        user_id = list(record[0].values())[0]
        email = list(record[1].values())[0]
        firstName = list(record[2].values())[0]
        lastName = list(record[3].values())[0]
        prefName = list(record[4].values())[0]
        profilePic = list(record[5].values())[0]
        reqSupp = bool(list(record[6].values())[0])
        
        if user_id in supporterDict:
            supporterDict[user_id].update({
                # "email":email,
                "first_name":firstName,
                "last_name":lastName,
                "preferred_name":prefName,
                "profile_picture":profilePic,
                "request_supporter":reqSupp
            })
    # The supporterDict is now filled with user_ids that map to title, current employer, email, first_name, preferred_name, last name, profile pic
    # Next we will add tags
    
    query=(
        "SELECT supporter_tags.user_id_, supporter_tags.tag_id, tag_name FROM supporter_tags INNER JOIN tags ON supporter_tags.tag_id=tags.tag_id"
    )
    #execute query
    response = client.execute_statement(secretArn=rds_config.SECRET_ARN,
                                        database=rds_config.DB_NAME,
                                        resourceArn=rds_config.ARN,
                                        sql=query)
    for record in response["records"]:
        user_id = list(record[0].values())[0]
        tagID = list(record[1].values())[0]
        tagName = list(record[2].values())[0]
        if user_id in supporterDict:
            if "tags" not in supporterDict[user_id]:
                supporterDict[user_id].update({
                    "tags":[(tagName, tagID)]
                })
            else:
                supporterDict[user_id]["tags"].append((tagName, tagID))
                
    for suppID in supporterDict.keys():
        if "tags" not in supporterDict[suppID]:
            supporterDict[suppID].update({
                    "tags":[]
                })
                
    # The supporterDict just now got user_ids that map to tags which are a list of tuples that contain (tagName, tagID)
    # The supporterDict is now filled with user_ids that map to title, current employer, email, first_name, preferred_name, last name, profile pic, tags
    # next we will get the types of appointments
    
    query=(
        "SELECT supp_appt.user_id_, supp_appt.type_id, appointment_name FROM supp_appt INNER JOIN appointment_type ON supp_appt.type_id=appointment_type.type_id"
    )
    #execute query
    response = client.execute_statement(secretArn=rds_config.SECRET_ARN,
                                        database=rds_config.DB_NAME,
                                        resourceArn=rds_config.ARN,
                                        sql=query)
    for record in response["records"]:
        user_id = list(record[0].values())[0]
        apptTypeID = list(record[1].values())[0]
        apptTypeName = list(record[2].values())[0]
        if user_id in supporterDict:
            if "apptTypes" not in supporterDict[user_id]:
                supporterDict[user_id].update({
                    "apptTypes":[(apptTypeName, apptTypeID)]
                })
            else:
                supporterDict[user_id]["apptTypes"].append((apptTypeName, apptTypeID))
    
    for suppID in supporterDict.keys():
        if "apptTypes" not in supporterDict[suppID]:
            supporterDict[suppID].update({
                    "apptTypes":[]
                })
    
    # The supporterDict just now got user_ids that map to apptTypes which are a list of tuples that contain (apptTypeName, apptTypeID)
    # The supporterDict is now filled with user_ids that map to title, current employer, email, first_name, preferred_name, last name, profile pic, tags, apptTypes
    # next we will get the supporter types
    
    query=(
        "SELECT supporter_type.user_id_, supporter_type.supp_type_id, supp_type FROM supporter_type INNER JOIN type_of_supporter ON supporter_type.supp_type_id=type_of_supporter.supp_type_id"
    )
    #execute query
    response = client.execute_statement(secretArn=rds_config.SECRET_ARN,
                                        database=rds_config.DB_NAME,
                                        resourceArn=rds_config.ARN,
                                        sql=query)
                                        
    for record in response["records"]:
        user_id = list(record[0].values())[0]
        supp_type_id = list(record[1].values())[0]
        supp_type = list(record[2].values())[0]
        if user_id in supporterDict:
            if "suppType" not in supporterDict[user_id]:
                supporterDict[user_id].update({
                    "suppType":[(supp_type, supp_type_id)]
                })
            else:
                supporterDict[user_id]["suppType"].append((supp_type, supp_type_id))
    
    for suppID in supporterDict.keys():
        if "suppType" not in supporterDict[suppID]:
            supporterDict[suppID].update({
                    "suppType":[]
                })
                
    # The supporterDict just now got user_ids that map to suppType which are a list of tuples that contain (supp_type, supp_type_id)
    # The supporterDict is now filled with user_ids that map to title, current employer, email, first_name, preferred_name, last name, profile pic, tags, apptType, suppType
    # next we will get the availability
    
    query=(
        "SELECT user_id_, start_time, end_time, appt_date FROM availability_supp"
    )
    #execute query
    response = client.execute_statement(secretArn=rds_config.SECRET_ARN,
                                        database=rds_config.DB_NAME,
                                        resourceArn=rds_config.ARN,
                                        sql=query)
    
    for record in response["records"]:
        user_id = list(record[0].values())[0]
        start_time = list(record[1].values())[0]
        end_time = list(record[2].values())[0]
        appt_date = list(record[3].values())[0]
        if user_id in supporterDict:
            if "availability" not in supporterDict[user_id]:
                supporterDict[user_id].update({
                    "availability":[(start_time, end_time, appt_date)]
                })
            else:
                supporterDict[user_id]["availability"].append((start_time, end_time, appt_date))
    
    for suppID in supporterDict.keys():
        if "availability" not in supporterDict[suppID]:
            supporterDict[suppID].update({
                    "availability":[]
                })
                
    # The supporterDict just now got user_ids that map to availability which are a list of tuples that contain (start_time, end_time, appt_date)
    # The supporterDict is now filled with user_ids that map to title, current employer, email, first_name, preferred_name, last name, profile pic, tags, apptType, suppType, availability
    # next we will get the rating
    
    query=(
        "SELECT supporter_id, rating FROM appointments AS A INNER JOIN student_feedback AS SF ON A.appointment_id=SF.appointment_id"
    )
    #execute query
    response = client.execute_statement(secretArn=rds_config.SECRET_ARN,
                                        database=rds_config.DB_NAME,
                                        resourceArn=rds_config.ARN,
                                        sql=query)
    for record in response["records"]:
        user_id = list(record[0].values())[0]
        if(list(record[1].values())[0] != ""):
            rating = int(list(record[1].values())[0])
            if user_id in supporterDict:
                if "rating" not in supporterDict[user_id]:
                    supporterDict[user_id].update({
                        "rating":[rating]
                    })
                else:
                    supporterDict[user_id]["rating"].append(rating)
    
    for suppID in supporterDict.keys():
        if "rating" not in supporterDict[suppID]:
            supporterDict[suppID].update({
                    "rating":""
                })
        else:
            myList=supporterDict[suppID]["rating"]
            answer=sum(myList)/len(myList)
            supporterDict[suppID]["rating"]=answer
    
    
    return{
        'body': json.dumps(supporterDict),
        'headers': response_headers,
        'statusCode': 200
    }
