import { SignJWT, jwtVerify } from 'jose';

// This is only for testing, in production we'd want to use an SSM parameter or Secrets Manager secret
const clientKey = 'testing123';

export async function signClientJwt(client) {
  return await new SignJWT(client)
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(clientKey);
}

export async function verifyClientJwt(jwt) {
  return await jwtVerify(jwt, clientKey); // { payload, protectedHeader }
}
