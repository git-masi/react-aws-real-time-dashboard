import { DynamoDB } from 'aws-sdk';

const { CONNECTIONS_TABLE_NAME } = process.env;
const dynamodb = new DynamoDB.DocumentClient();

export async function addConnection(item) {
  const params = {
    TableName: CONNECTIONS_TABLE_NAME,
    Item: item,
  };

  return dynamodb.put(params).promise();
}
