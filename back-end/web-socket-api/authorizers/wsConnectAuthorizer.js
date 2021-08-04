export const handler = wsConnectAuthorizer;

async function wsConnectAuthorizer(event, context) {
  console.info(event);

  try {
    const { queryStringParameters = {}, methodArn } = event;
    const { authorization } = queryStringParameters;

    // Testing only, use JWT in production
    if (!authorization || authorization !== '98765' || !methodArn)
      throw new Error('Unauthorized');

    const allowPolicy = createAllowPolicy(authorization, methodArn);

    context.succeed(allowPolicy);

    return authorization;
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
