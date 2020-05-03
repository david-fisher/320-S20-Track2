import json
import boto3
#Last Updated
#5/3/2020
s3 = boto3.client('s3') #S3 object
def lambda_handler(event, context):
    #Initializing the variables
    bucket = 't2-bucket-storage'
    key = 'FAQ.txt'
    
    #CORS headers
    response_headers = {}

    response_headers["X-Requested-With"] = "*"
    response_headers["Access-Control-Allow-Origin"] = "*"
    response_headers["Access-Control-Allow-Headers"] = "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with'"
    response_headers["Access-Control-Allow-Methods"] = "OPTIONS,POST,GET,PUT,DELETE"
    
    #Getting the data from the bucket
    data = s3.get_object(Bucket=bucket, Key=key) 
    
    jsonData = data['Body'].read() #This will read the faq page for its contents
    #Returning the faq content here
    return {
        'statusCode': 200,
        'body': jsonData,
        'headers': response_headers,
        'isBase64Encoded': False
    }
