import { DynamoDB } from 'aws-sdk';

const { CONNECTIONS_TABLE_NAME } = process.env;
const dynamoDb = new DynamoDB.DocumentClient();

export async function addConnection(item) {
  const putParams = {
    TableName: CONNECTIONS_TABLE_NAME,
    Item: item,
  };

  return dynamoDb.put(putParams).promise();
}

export async function removeConnection(connectionId) {
  const deleteParams = {
    TableName: CONNECTIONS_TABLE_NAME,
    Key: {
      connectionId,
    },
  };

  return dynamoDb.delete(deleteParams).promise();
}
