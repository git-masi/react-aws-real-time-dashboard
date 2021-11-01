import { SignJWT } from 'jose';

export async function createClientJwt(client) {
  // This is only for testing, in production we'd want to use an SSM parameter or Secrets Manager secret
  const privateKey = 'test';

  return await new SignJWT(client)
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(privateKey);
}
