import { nanoid } from 'nanoid';
import { add } from 'date-fns';
import { enableCreateFakeOrdersRule } from '../../../utils/orders';
import { createWriteTransactionParams, dynamoDb } from '../../../utils/dynamo';
import { pkValues } from '../../../utils/constants';
import { apiResponse, HttpError } from '../../../utils/http';
import { commonMiddleware } from '../../../utils/middleware';
import { signClientJwt } from '../../../utils/jwt';

const { MAIN_TABLE_NAME } = process.env;

export const handler = commonMiddleware(handleCreateClient);

async function handleCreateClient(event) {
  try {
    const client = buildClient();
    const params = createWriteTransactionParams([MAIN_TABLE_NAME, client]);
    const jwt = await signClientJwt(client);

    await dynamoDb.transactWrite(params);

    await enableCreateFakeOrdersRule();

    return apiResponse({ body: { clientToken: jwt }, cors: true });
  } catch (error) {
    console.info(error);

    if (error instanceof HttpError)
      return apiResponse({ ...error, cors: true });

    return apiResponse({
      statusCode: 500,
      cors: true,
    });
  }

  function buildClient() {
    const now = new Date();
    const created = now.toISOString();
    const clientId = nanoid(8);
    const sk = clientId;
    const pk = pkValues.client;
    const expiresAt = add(now, { days: 1 }).toISOString();

    return { pk, sk, created, clientId, expiresAt };
  }
}
