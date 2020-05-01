import json
import boto3

s3 = boto3.client('s3')  # S3 object


def lambda_handler(event, context):
    # Initializing the variables
    bucket = 't2-bucket-storage'
    key = 'FAQ.txt'

    # Getting the data from the bucket
    data = s3.get_object(Bucket=bucket, Key=key)

    jsonData = data['Body'].read()  # This will read the faq page for its contents
    # Returning the webpage here
    return {
        'statusCode': 200,
        'body': jsonData
    }