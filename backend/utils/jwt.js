import { createSecretKey } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';

// This is for testing purposes only
// Use SSM secret parameter or Secrets Manager secret in production
const APP_SECRET = '0302053c-d0e6-499b-9efe-dad9b629e0ac';

export const signClientJwt = async (client) =>
  await new SignJWT(client)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(createSecretKey(Buffer.from(APP_SECRET, 'utf8')));

export const verifyClientJwt = async (jwt) =>
  await jwtVerify(jwt, createSecretKey(Buffer.from(APP_SECRET, 'utf8'))); // { payload, protectedHeader }
