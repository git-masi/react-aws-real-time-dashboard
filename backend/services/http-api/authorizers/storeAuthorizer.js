export const handler = storeAuthorizer;

async function storeAuthorizer(event, context, callback) {
  console.info(event);
  const { authorizationToken, methodArn } = event;

  try {
    if (!authorizationToken) {
      throw new Error('Authorization is missing');
    }

    const token = authorizationToken.replace('Bearer ', '').trim();

    // Testing only, use JWT in production
    if (token !== '98765') {
      throw new Error('Auth token is invalid');
    }

    return callback(null, createAllowPolicy(token, methodArn));
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
