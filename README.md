# 320-S20-Track2
Integration Track 2

REPOSITORY LINK: https://github.com/david-fisher/320-S20-Track2

# Lambdas

## Writing and Deploying Lambdas

 - Install the **AWS CLI** from here [https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html). 
 - Write the lambda code in an IDE such as Visual Studio Code.
 - Once done writing lambda, open the AWS CLI, enter your AWS credentials, zip up your lambda files and export the files to AWS.
	 - If the lambda function has not been made in AWS yet, use the create function command:
		 - `aws lambda create-function \
	    --function-name my-function \
	    --runtime nodejs10.x \
	    --zip-file fileb://my-function.zip \
	    --handler my-function.handler \
	    --role arn:aws:iam::123456789012:role/service-role/MyTestFunction-role-tges6bf4`
    
    - Else use the update function command:
	    - `aws lambda update-function-code \
	    --function-name  my-function \
	    --zip-file fileb://my-function.zip`
 
 ## Testing Lambdas
 
 - Install **Postman** here [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
 - Open Postman, make sure that the lambda is connected to an endpoint in the API Gateway, enter the URL/endpoint of the lambda, write tests for the expected response, enter the request parameters/body if there are any, choose the correct HTTP request method and hit send. 
 - Observe the response and the test results.


# Cloud

## Monitoring the database
- Go to your AWS account.
- Open the Management Console and click on RDS.
- Click on Databases and select the chosen database, here you can view your database’s information

## Sanitizing the database
- the database needs to be regularly monitored to ensure that all values in the database are actually meant to be there and that not too much storage is used
- In the case where there is information in the database that is wished to be removed, a user with proper permissions can simply remove unwanted data using simple MySQL code

## Creating an admin account
- Admin accounts must be created within AWS for security reasons
- Once navigated into the database, you can execute the following code:
set @u_id = (1);
set @em = (select email from user where user_id_ = @u_id);
set @pa = (select password_ from user where user_id_ = @u_id);
insert into admin values (@u_id, @em, @pa);
- All that needs to be changed is in the first line to whatever user_id_ you want to become an admin

## Monitoring the API gateway
- Go to your AWS account
- Open the Management Console and click on API gateway
- Choose the API you want to monitor and click on it, here you can monitor the working of your API

## S3 bucket
- Go to [https://docs.aws.amazon.com/quickstarts/latest/s3backup/step-1-create-bucket.html](https://docs.aws.amazon.com/quickstarts/latest/s3backup/step-1-create-bucket.html) and follow step 1 to create a bucket
- Go to [https://docs.aws.amazon.com/quickstarts/latest/s3backup/step-2-upload-file.html](https://docs.aws.amazon.com/quickstarts/latest/s3backup/step-1-create-bucket.html) and follow step 2 to upload a file to the bucket
- Go to [https://docs.aws.amazon.com/quickstarts/latest/s3backup/step-4-delete-file.html](https://docs.aws.amazon.com/quickstarts/latest/s3backup/step-1-create-bucket.html) and follow step 4 to delete a file from the bucket

	##Updating the FAQ file in the S3 Bucket
	- Go to the S3 bucket, follow the steps mentioned above to download the FAQ file, do not  change its name.
	- Delete the above mentioned file from the S3 bucket using the steps mentioned above.
	- Make the desired changes in file, make sure to keep the file in the given format:
		{
	"1": {
		"question": "Who built this site?",
		"answer": "This site was built by Umass Amherst Students for a Software Engineering class."
	},
	"2": {
		"question": "How do I make an appointment?",
		"answer": "If you are logged in as a student you can navigate to 'Find a Supporter' from the 'Appointments' dropdown."
	}
}
- After making the desired changes, upload the file using the above mentioned steps.


# FrontEnd

## Downloading the Files
-Navigate to the GitHub repository included at the top of this README
-You should be on the page 320-S20-Track2- from here, click clone if you want to use GitHub Desktop or download if you simply want the files as a zip.
-You should now have a folder titled something similar to ‘320-S20-Track2’ on your device. To start working with the website, we will be looking at the ‘client’ folder within.

## Editing The Website
The following steps are taken from the official Angular setup page, starting from step 1: https://angular.io/guide/setup-local
- Install an IDE (ex. the latest version of Webstorm by JetBrains)
- Open the ‘client’ folder in your IDE (WebStorm has an open as project functionality on folders)
- Open any terminal
- Run ‘npm install -g @angular/cli’
- Then, again in the terminal, navigate to the project directory with the ‘cd’ command followed by the file path
- For example, ‘cd C:\Users\admin\Documents\GitHub\320-S20-Track2\client’ 
- Once in the project directory, run ‘ng serve --open’
- The website should now be open on http://localhost:4200/ 
- In your IDE, navigate to /client/src/app. Here you will find the bulk of the code in different folders, each representing different components of the website. Any edits made to the code in the IDE will be reflected immediately on the localhost
- The site is now ready to be edited and/or maintained.

## Deploying The Website
Once you have the code in an IDE of your choice, and have successfully configured an Amazon S3 bucket, you are now ready to deploy the latest version of the Trellis platform. However, it is not as simple as uploading the contents of the site itself to the bucket.

- In your IDE of choice, instead of running the Start command, run the Build command. This will compile the files and bundle them together into a deployable form.
- This new bundle of files will go into a folder called “dist” in your main “app” directory in your IDE.
- These files do not have to be altered at all in order to deploy them.
- Log onto the Amazon AWS platform and go to the main portal.
- In the search bar for services, type in “S3.” Click the blue hyperlink that appears below.
You will be redirected to a list of S3 buckets. Choose the one you intend to deploy the site onto.
- The page will show the selected S3 bucket. If it has contents inside of it, hit the checkmark in the top bar to select all files, go to the Actions drop down, and press delete. This will empty the S3 bucket.
- Proceed to upload or drag in the contents of the “dist” folder created by your IDE. Not that you should not upload the dist folder itself. This is because the index.html included in the file bundle file MUST not be in any sort of subfolder, and that it has to be in the same directory as all the other non-asset files.
- Finally, make sure that bucket hosting is active. Click the Properties tab in the S3 bucket and click Static Website Hosting. Make sure that the Bucket Hosting box is checked, and click save.

Your website is now deployed on AWS. The Static Website Hosting box will give you a URL to access your website.
