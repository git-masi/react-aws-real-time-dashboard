import { apiResponse } from '../../utils/http';
import { commonMiddleware } from '../../utils/middleware';

export const handler = commonMiddleware(clients);

function clients(event) {
  try {
    return apiResponse({ statusCode: 200, cors: true });
  } catch (error) {
    console.info(error);
    return apiResponse({ statusCode: 500, cors: true });
  }
}
