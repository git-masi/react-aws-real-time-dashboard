# React AWS Realtime Dashboard

This repo shows how you might use WebSockets with a serverless backend without using something like AWS Amplify. It was originally used as a demo for a talk I gave at the Charm City JavaScript meetup in 2021.

The frontend is a React application that displays a simple dashboard of streaming updates.

The backend uses Serverless Framework for AWS. Lambda functions are written in JavaScript (Node). DynamoDB is the primary database.
