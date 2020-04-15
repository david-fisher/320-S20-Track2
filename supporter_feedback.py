import boto3
import json

from package import db_config

def supporter_feedbacK(event, context):
    if 'rating' in event:
        rating = event['rating']
    if 'comment' in event:
        comment = event['comment']
    if 'supporter_id' in event:
        supporter_id = event['supporter_id']
    
    