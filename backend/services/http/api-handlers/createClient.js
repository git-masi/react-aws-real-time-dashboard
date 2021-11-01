import { nanoid } from 'nanoid';
import {
  eventBridge,
  eventBridgeRuleOperations,
} from '../../../utils/eventBridge';
import { createWriteTransactionParams } from '../../../utils/dynamo';
import { pkValues } from './mainTable';
import { apiResponse, HttpError } from '../../../utils/http';
import { commonMiddleware } from '../../../utils/middleware';

const { SERVICE_NAME } = process.env;

export const handler = commonMiddleware(handleCreateClient);

async function handleCreateClient(event) {
  try {
    const created = new Date().toISOString();
    const clientId = nanoid(8);
    const sk = `${created}#${clientId}`;
    const pk = pkValues.client;
    const client = { pk, sk, created, clientId };

    const params = createWriteTransactionParams([['table names goes here']]);

    return apiResponse({ body: result, cors: true });
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

// const params = {
//   Name: '', // required
//   EventBusName: '',
// };
// await eventBridge.rule(eventBridgeRuleOperations.enable, params);

async function findFakeOrderRule() {
  const params = {
    EventBusName: 'default',
    NamePrefix: SERVICE_NAME,
  };
  const rules = await eventBridge.rule(eventBridgeRuleOperations.list, params);
  console.log(rules);
  return rules.find((rule) => /CreateFakeOrders/i.test(rule?.Name));
}

// {
//   "Rules": [
//       {
//           "Name": "rardash-http-d-FakeOrdersEventsRuleSche-AL4WR31R991Y",
//           "Arn": "arn:aws:events:us-east-1:967597777336:rule/rardash-http-d-FakeOrdersEventsRuleSche-AL4WR31R991Y",
//           "State": "DISABLED",
//           "ScheduleExpression": "rate(1 minute)",
//           "EventBusName": "default"
//       }
//   ]
// }
