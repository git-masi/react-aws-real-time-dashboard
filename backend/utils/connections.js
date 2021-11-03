import { pkValues } from './constants';
import { createWriteTransactionParams, dynamoDb, getFirstItem } from './dynamo';

const { CONNECTIONS_TABLE_NAME } = process.env;

export async function addConnection(item) {
  const pk = pkValues.connection;
  const connectionIdSk = item.connectionId;
  const clientIdSk = `${item.clientId}#${item.connectionId}`;

  const params = createWriteTransactionParams(
    [CONNECTIONS_TABLE_NAME, { ...item, pk, sk: connectionIdSk }],
    [CONNECTIONS_TABLE_NAME, { ...item, pk, sk: clientIdSk }]
  );

  return dynamoDb.transactWrite(params);
}

export async function removeConnection(connectionId) {
  const connection = getFirstItem(await getConnectionById(connectionId));

  const params = {
    TransactItems: [
      {
        Delete: {
          Key: {
            pk: pkValues.connection,
            sk: connection.connectionId,
          },
          TableName: CONNECTIONS_TABLE_NAME,
        },
      },
      {
        Delete: {
          Key: {
            pk: pkValues.connection,
            sk: `${connection.clientId}#${connection.connectionId}`,
          },
          TableName: CONNECTIONS_TABLE_NAME,
        },
      },
    ],
  };

  return dynamoDb.transactWrite(params);
}

export async function getConnectionsByClient(clientId) {
  const params = {
    TableName: CONNECTIONS_TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(clientId, :clientId)',
    ExpressionAttributeValues: {
      ':pk': pkValues.connection,
      ':clientId': clientId,
    },
  };

  return dynamoDb.query(params);
}

export async function getConnectionById(connectionId) {
  const params = {
    TableName: CONNECTIONS_TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and sk = :sk',
    ExpressionAttributeValues: {
      ':pk': pkValues.connection,
      ':sk': connectionId,
    },
  };

  return dynamoDb.query(params);
}
