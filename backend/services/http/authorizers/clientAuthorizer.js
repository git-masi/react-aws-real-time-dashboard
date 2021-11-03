import { isTokenExpired, verifyClientJwt } from '../../../utils/jwt';
import { createAllowPolicy } from '../../../utils/iam';

export const handler = clientAuthorizer;

async function clientAuthorizer(event, context, callback) {
  console.info(event);
  const { authorizationToken, methodArn } = event;

  try {
    if (!authorizationToken) {
      throw new Error('Authorization is missing');
    }

    const token = authorizationToken.replace('Bearer ', '').trim();

    const { payload: claims } = await verifyClientJwt(token);
    const { clientId } = claims;

    if (!clientId || isTokenExpired(claims)) {
      throw new Error('Auth token is invalid');
    }

    return callback(null, createAllowPolicy(clientId, methodArn));
  } catch (error) {
    console.info(error);
    return callback('Unauthorized');
  }
}
