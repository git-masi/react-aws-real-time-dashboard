import { EventBridge } from 'aws-sdk';

const eb = new EventBridge();

export const eventBridge = {
  putRule(params) {
    return eb.putRule(params).promise();
  },
  deleteRule(params) {
    return eb.deleteRule(params).promise();
  },
  enableRule(params) {
    return eb.enableRule(params).promise();
  },
  disableRule(params) {
    return eb.disableRule(params).promise();
  },
  listRules(params) {
    return eb.listRules(params).promise();
  },
};
