import {
  eventBridge,
  eventBridgeRuleOperations,
} from '../../utils/eventBridge';
import { apiResponse } from '../../utils/http';
import { commonMiddleware } from '../../utils/middleware';

export const handler = commonMiddleware(clients);

async function clients(event) {
  try {
    const params = {
      Name: '', // required
      EventBusName: '',
    };
    await eventBridge.rule(eventBridgeRuleOperations.enable, params);
    return apiResponse({ statusCode: 200, cors: true });
  } catch (error) {
    console.info(error);
    return apiResponse({ statusCode: 500, cors: true });
  }
}
