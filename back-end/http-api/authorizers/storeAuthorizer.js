export const handler = storeAuthorizer;

async function storeAuthorizer(event, context, callback) {
  try {
    if (typeof event.authorizer === 'undefined') {
      throw new Error('Authorization is missing');
    }

    const { authorizer: storeId, methodArn } = event;

    if (storeId !== '98765') {
      throw new Error('Unauthorized');
    }

    return callback(null, createAllowPolicy(storeId, methodArn));
  } catch (error) {
    console.info(error);
    return callback('Unauthorized');
  }
}

function createAllowPolicy(principalId, resource) {
  return createPolicy(principalId, 'Allow', resource);
}

function createPolicy(principalId, effect, resource) {
  const authResponse = { principalId };

  if (effect && resource) {
    const statementOne = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    };

    const policyDocument = {
      Version: '2012-10-17',
      Statement: [statementOne],
    };

    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}
