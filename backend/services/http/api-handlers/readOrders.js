import { commonMiddleware } from '../../../utils/middleware';
import { apiResponse, HttpError } from '../../../utils/http';
import { dynamoDb } from '../../../utils/dynamo';

const { MAIN_TABLE_NAME } = process.env;

export const handler = commonMiddleware(handleReadOrders);

async function handleReadOrders(event) {
  const { queryStringParameters } = event;

  try {
    const dbResults = await getOrders(parseQueryParams(queryStringParameters));
    const items = getItems(dbResults);

    return apiResponse({ body: items, cors: true });
  } catch (error) {
    console.info(error);

    if (error instanceof HttpError)
      return apiResponse({ ...error, cors: true });

    return apiResponse({
      statusCode: 500,
      cors: true,
    });
  }
}

function parseQueryParams(queryStringParameters) {
  return Object.entries(queryStringParameters).reduce((acc, [key, value]) => {
    switch (key) {
      case 'limit':
        acc[key] = +value;
        break;

      case 'asc':
        acc[key] = value !== 'false';
        break;

      case 'startSk':
        acc[key] = decodeURIComponent(value);
        break;

      default:
        acc[key] = value;
        break;
    }

    return acc;
  }, {});
}

function getOrders(config = {}) {
  const { asc = true, limit, startSk } = config;
  const dbQuery = {
    TableName: MAIN_TABLE_NAME,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': pkValues.order,
    },
    ScanIndexForward: asc,
  };

  if (limit) {
    dbQuery.Limit = limit;
  }

  if (startSk) {
    dbQuery.ExclusiveStartKey = {
      pk: pkValues.order,
      sk: startSk,
    };
  }

  return dynamoDb.query(dbQuery);
}
