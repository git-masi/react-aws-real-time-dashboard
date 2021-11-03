import { pkValues } from './constants';
import { dynamoDb } from './dynamo';
import { isEmpty } from './data';

const { MAIN_TABLE_NAME } = process.env;

export async function readAllClients(items = [], ExclusiveStartKey = {}) {
  const params = {
    TableName: MAIN_TABLE_NAME,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': pkValues.client,
    },
  };

  if (!isEmpty(ExclusiveStartKey)) params.ExclusiveStartKey = ExclusiveStartKey;

  const { Items, LastEvaluatedKey } = await dynamoDb.query(params);

  const result = [...items, ...Items];

  if (LastEvaluatedKey && !isEmpty(LastEvaluatedKey))
    return await readAllClients(result, LastEvaluatedKey);

  return result;
}
