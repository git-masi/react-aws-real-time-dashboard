import { EventBridge } from 'aws-sdk';

const eb = new EventBridge();

export const eventBridgeRuleOperations = Object.freeze({
  add: 'putRule',
  remove: 'deleteRule',
  enable: 'enableRule',
  disable: 'disableRule',
  list: 'listRules',
});

export const eventBridge = {
  rule(operation, params) {
    return eb[operation]?.(params).promise();
  },
};
