import { isTokenExpired, verifyClientJwt } from '../../../utils/jwt';
import { createAllowPolicy } from '../../../utils/iam';

export const handler = wsConnectAuthorizer;

async function wsConnectAuthorizer(event, context) {
  console.info(event);
  const { queryStringParameters = {}, methodArn } = event;
  const { authorization: token } = queryStringParameters;

  try {
    const { payload: claims } = await verifyClientJwt(token);
    const { clientId } = claims;

    if (!clientId || isTokenExpired(claims)) {
      throw new Error('Auth token is invalid');
    }

    const allowPolicy = createAllowPolicy(clientId, methodArn);

    context.succeed(allowPolicy);

    return claims;
  } catch (error) {
    console.log(error);
    context.fail('Authorizer verification failed');
  }
}
