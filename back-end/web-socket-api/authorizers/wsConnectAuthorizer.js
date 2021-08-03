export const handler = wsConnectAuthorizer;

async function wsConnectAuthorizer(event, context) {
  try {
    const { queryStringParameters = {}, methodArn } = event;
    const { authorizer: storeId } = queryStringParameters;
    const unauthorizedError = new Error('Unauthorized');

    if (!storeId || storeId !== '98765' || !methodArn) throw unauthorizedError;

    const allowPolicy = createAllowPolicy(storeId, methodArn);

    context.succeed(allowPolicy);

    return storeId;
  } catch (error) {
    console.log(error);
    context.fail('Authorizer verification failed');
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
