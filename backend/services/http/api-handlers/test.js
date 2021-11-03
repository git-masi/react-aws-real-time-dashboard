import { apiResponse } from '../../../utils/http';
// import { verifyClientJwt } from '../../../utils/jwt';
import { commonMiddleware } from '../../../utils/middleware';
import { eventBridge } from '../../../utils/eventBridge';

const {
  // MAIN_TABLE_NAME,
  JOB_SERVICE_NAME,
} = process.env;

export const handler = commonMiddleware(test);

async function test(event) {
  try {
    const fakeOrderRule = await findFakeOrderRule();

    if (fakeOrderRule) {
      const isDisabled = fakeOrderRule.State === 'DISABLED';

      if (isDisabled) {
        await eventBridge.enableRule({
          Name: fakeOrderRule.Name,
          EventBusName: 'default',
        });
      } else {
        await eventBridge.disableRule({
          Name: fakeOrderRule.Name,
          EventBusName: 'default',
        });
      }
    }

    return apiResponse({ body: fakeOrderRule });
  } catch (error) {
    console.info(error);
    return apiResponse({ statusCode: 500 });
  }
}

async function findFakeOrderRule() {
  const params = {
    EventBusName: 'default',
    NamePrefix: JOB_SERVICE_NAME,
  };
  const { Rules: rules } = await eventBridge.listRules(params);

  return rules.find((rule) => /CreateFakeOrders/i.test(rule?.Name));
}
