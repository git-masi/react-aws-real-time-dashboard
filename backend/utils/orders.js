import { eventBridge } from './eventBridge';

const { JOB_SERVICE_NAME } = process.env;

export async function findCreateFakeOrdersRule() {
  const params = {
    EventBusName: 'default',
    NamePrefix: JOB_SERVICE_NAME,
  };
  const { Rules: rules } = await eventBridge.listRules(params);

  return rules.find((rule) => /CreateFakeOrders/i.test(rule?.Name));

  // Example result from listRules
  // {
  //   "Rules": [
  //       {
  //           "Name": "rardash-jobs-dev-CreateFakeOrdersEventsRuleSchedul-17QK9YWVGV6XU",
  //           "Arn": "arn:aws:events:us-east-1:967597777336:rule/rardash-jobs-dev-CreateFakeOrdersEventsRuleSchedul-17QK9YWVGV6XU",
  //           "State": "DISABLED",
  //           "ScheduleExpression": "rate(1 minute)",
  //           "EventBusName": "default"
  //       }
  //   ]
  // }
}

export async function enableCreateFakeOrdersRule() {
  const fakeOrderRule = await findCreateFakeOrdersRule();
  const disabled = fakeOrderRule && fakeOrderRule.State === 'DISABLED';

  if (disabled) {
    await eventBridge.enableRule({
      Name: fakeOrderRule.Name,
      EventBusName: 'default',
    });
  }
}

export async function disableCreateFakeOrdersRule() {
  const fakeOrderRule = await findCreateFakeOrdersRule();
  const enabled = fakeOrderRule && fakeOrderRule.State === 'ENABLED';

  if (enabled) {
    await eventBridge.disableRule({
      Name: fakeOrderRule.Name,
      EventBusName: 'default',
    });
  }
}
