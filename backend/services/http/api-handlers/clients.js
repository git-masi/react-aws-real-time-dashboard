import {
  eventBridge,
  eventBridgeRuleOperations,
} from '../../../utils/eventBridge';
import { isEmpty } from '../../../utils/data';
import {
  apiResponse,
  HttpError,
  httpMethods,
  methodRouter,
  pathRouter,
} from '../../../utils/http';
import { commonMiddleware } from '../../../utils/middleware';
import { createClient } from '../db/clients';

const { SERVICE_NAME } = process.env;

export const handler = commonMiddleware(clients);

async function clients(event) {
  const methodRoutes = {
    [httpMethods.GET]: handleGetMethods,
    [httpMethods.POST]: handlePostMethods,
  };
  const router = methodRouter(methodRoutes);

  try {
    const result = await router(event);

    if (isEmpty(result)) return apiResponse({ cors: true });

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

function handlePostMethods(event) {
  const paths = {
    '/client': handleCreateClient,
  };
  const router = pathRouter(paths);

  return router(event);

  function handleCreateClient(event) {
    const { body } = event;

    const client = await createClient();
    // return createOrder({ ...body, storeId: authorizer.principalId });
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
