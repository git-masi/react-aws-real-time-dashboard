import {
  eventBridge,
  eventBridgeRuleOperations,
} from '../../../utils/eventBridge';
import { apiResponse } from '../../../utils/http';
import { commonMiddleware } from '../../../utils/middleware';

const { SERVICE_NAME } = process.env;

export const handler = commonMiddleware(clients);

async function clients(event) {
  try {
    const fakeOrderRule = findFakeOrderRule();
    console.log(fakeOrderRule);
    // const params = {
    //   Name: '', // required
    //   EventBusName: '',
    // };
    // await eventBridge.rule(eventBridgeRuleOperations.enable, params);
    return apiResponse({ statusCode: 200, cors: true });
  } catch (error) {
    console.info(error);
    return apiResponse({ statusCode: 500, cors: true });
  }
}

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
//           "Name": "rardash-http-api-d-FakeOrdersEventsRuleSche-AL4WR31R991Y",
//           "Arn": "arn:aws:events:us-east-1:967597777336:rule/rardash-http-api-d-FakeOrdersEventsRuleSche-AL4WR31R991Y",
//           "State": "DISABLED",
//           "ScheduleExpression": "rate(1 minute)",
//           "EventBusName": "default"
//       }
//   ]
// }
