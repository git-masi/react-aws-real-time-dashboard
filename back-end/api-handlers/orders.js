import { createOrder, getOrders } from '../db/orders';
import { getItems } from '../db/shared';
import { isEmpty } from '../utils/data';
import {
  apiResponse,
  HttpError,
  httpMethods,
  methodRouter,
  pathRouter,
} from '../utils/http';
import { commonMiddleware } from '../utils/middleware';

export const handler = commonMiddleware(orders);

async function orders(event) {
  const methodRoutes = {
    [httpMethods.GET]: handleGetMethods,
    [httpMethods.POST]: handlePostMethods,
  };
  const router = methodRouter(methodRoutes);

  try {
    const result = await router(event);

    if (isEmpty(result)) return apiResponse({ cors: true });

    return apiResponse({ body: result, cors: true });
  } catch (error) {
    console.info(error);

    if (error instanceof HttpError)
      return apiResponse({ ...error, cors: true });

    return apiResponse({
      statusCode: 500,
      cors: true,
    });
  }
}

function handleGetMethods(event) {
  const paths = {
    '/orders': handleGetOrders,
  };
  const router = pathRouter(paths);

  return router(event);

  async function handleGetOrders(event) {
    const { queryStringParameters } = event;
    const dbResults = await getOrders(parseQueryParams(queryStringParameters));

    return getItems(dbResults);
  }
}

function handlePostMethods(event) {
  const paths = {
    '/orders': handleCreateOrder,
  };
  const router = pathRouter(paths);

  return router(event);

  function handleCreateOrder(event) {
    const { body } = event;
    return createOrder(body);
  }
}

function parseQueryParams(queryStringParameters) {
  return Object.entries(queryStringParameters).reduce((acc, [key, value]) => {
    switch (key) {
      case 'limit':
        acc[key] = +value;
        break;

      case 'asc':
        acc[key] = value !== 'false';
        break;
        break;

      case 'startSk':
        acc[key] = decodeURIComponent(value);
        break;

      default:
        acc[key] = value;
        break;
    }

    return acc;
  }, {});
}
