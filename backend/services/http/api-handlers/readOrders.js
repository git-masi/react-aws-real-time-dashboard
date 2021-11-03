import { commonMiddleware } from '../../../utils/middleware';
import { apiResponse, HttpError } from '../../../utils/http';
import { dynamoDb, getItems } from '../../../utils/dynamo';
import { pkValues } from '../../../utils/constants';

const { MAIN_TABLE_NAME } = process.env;

export const handler = commonMiddleware(handleReadOrders);

async function handleReadOrders(event) {
  const { queryStringParameters, requestContext } = event;
  const {
    authorizer: { principalId: clientId },
  } = requestContext;

  try {
    const dbResults = await getOrders(
      clientId,
      parseQueryParams(queryStringParameters)
    );
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

function getOrders(clientId, config = {}) {
  const { asc = true, limit, startSk } = config;
  const dbQuery = {
    TableName: MAIN_TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': pkValues.order,
      ':sk': clientId,
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
