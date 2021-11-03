import { apiResponse } from '../../../utils/http';
import { verifyClientJwt } from '../../../utils/jwt';
import { commonMiddleware } from '../../../utils/middleware';

export const handler = commonMiddleware(test);

async function test(event) {
  const { body } = event;

  try {
    const { payload, protectedHeader } = await verifyClientJwt(
      body.clientToken
    );
    return apiResponse({ body: { payload, protectedHeader } });
  } catch (error) {
    console.info(error);
    return apiResponse({ statusCode: 500 });
  }
}
