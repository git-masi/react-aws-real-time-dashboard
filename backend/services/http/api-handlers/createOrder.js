import { commonMiddleware } from '../../../utils/middleware';
import { apiResponse, HttpError } from '../../../utils/http';
import { createWriteTransactionParams, dynamoDb } from '../../../utils/dynamo';
import { pkValues, orderStatuses } from '../../../utils/constants';

const { MAIN_TABLE_NAME } = process.env;

export const handler = commonMiddleware(handleCreateOrder);

async function handleCreateOrder(event) {
  try {
    const params = createWriteTransactionParams([
      MAIN_TABLE_NAME,
      buildNewOrder(),
    ]);

    await dynamoDb.transactWrite(params);

    return apiResponse({ cors: true });
  } catch (error) {
    console.info(error);

    if (error instanceof HttpError)
      return apiResponse({ ...error, cors: true });

    return apiResponse({
      statusCode: 500,
      cors: true,
    });
  }

  function buildNewOrder() {
    const {
      body,
      requestContext: { authorizer },
    } = event;
    const { principalId: clientId } = authorizer;
    const created = new Date().toISOString();
    const sk = `${created}#${clientId}`;

    return {
      ...body,
      clientId: authorizer.principalId,
      pk: pkValues.order,
      sk,
      created,
      status: orderStatuses.open,
    };
  }
}
