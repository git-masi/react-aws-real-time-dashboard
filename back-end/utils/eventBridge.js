import { EventBridge } from 'aws-sdk';

const eb = new EventBridge();

export const eventBridgeRuleOperations = Object.freeze({
  add: 'putRule',
  remove: 'deleteRule',
  enable: 'enableRule',
  disable: 'disableRule',
});

export const eventBridge = {
  rule(operation, ruleName, eventBusName) {
    const params = {
      Name: ruleName, // required
      EventBusName: eventBusName,
    };

    return eb[operation]?.(params).promise();
  },
};
