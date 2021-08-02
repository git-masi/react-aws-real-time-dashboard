import { DynamoDB } from 'aws-sdk';
import { nanoid } from 'nanoid';
import { orderStatuses } from '../schema/orders';
import { pkValues } from './mainTable';

const { MAIN_TABLE_NAME } = process.env;
const dynamoDb = new DynamoDB.DocumentClient();

export function getOrders(config = {}) {
  const { asc = true } = config;
  const dbQuery = {
    TableName: MAIN_TABLE_NAME,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': pkValues.order,
    },
    ScanIndexForward: asc,
  };

  return dynamoDb.query(dbQuery).promise();
}

export function createOrder(orderVals = {}) {
  const created = new Date().toISOString();
  const sk = `${created}#${nanoid(8)}`;
  const dbTransaction = {
    TransactItems: [
      {
        Put: {
          TableName: MAIN_TABLE_NAME,
          Item: {
            ...orderVals,
            pk: pkValues.order,
            sk,
            created,
            status: orderStatuses.open,
          },
        },
      },
    ],
  };

  return dynamoDb.transactWrite(dbTransaction).promise();
}
