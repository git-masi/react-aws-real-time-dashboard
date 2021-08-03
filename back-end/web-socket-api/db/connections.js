import { DynamoDB } from 'aws-sdk';

const { CONNECTIONS_TABLE_NAME } = process.env;
const dynamoDb = new DynamoDB.DocumentClient();

export async function addConnection(item) {
  const params = {
    TableName: CONNECTIONS_TABLE_NAME,
    Item: item,
  };

  return dynamoDb.put(params).promise();
}
