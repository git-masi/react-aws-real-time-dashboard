import { commonMiddleware } from '../../../utils/middleware';
import { apiResponse } from '../../../utils/http';
import { createUpdateTransactionParams, dynamoDb } from '../../../utils/dynamo';

const { MAIN_TABLE_NAME } = process.env;

export const handler = commonMiddleware(updateOrder);

async function updateOrder(event) {
  const {
    body: { pk, sk, status },
  } = event;

  try {
    console.info(`Attempting to update order ${pk}#${sk}`);

    const params = createUpdateTransactionParams([
      MAIN_TABLE_NAME,
      { pk, sk },
      { status },
    ]);

    await dynamoDb.transactWrite(params);

    return apiResponse({ statusCode: 200, cors: true });
  } catch (error) {
    console.info(error);
    return apiResponse({ statusCode: 500, cors: true });
  }
}
