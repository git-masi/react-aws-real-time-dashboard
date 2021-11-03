import cloneDeep from 'lodash.clonedeep';

export class HttpError extends Error {
  constructor(statusCode = 500, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  static BadRequest = (message) => {
    throw new HttpError(400, message);
  };
}

export function apiResponse(config = {}) {
  try {
    validateApiResponseConfig(config);

    const {
      statusCode = 200,
      cors = false,
      event,
      whitelist,
      headers,
      body,
    } = config;

    const response = { statusCode };

    // refactor this
    if (cors) {
      if (event && whitelist) {
        const origin = event?.headers?.origin ?? '';
        if (whitelist.includes(origin)) {
          response.headers = {
            ...response.headers,
            'Access-Control-Allow-Origin': origin,
          };
        } else {
          console.info(
            `request origin not in whitelist\norigin: ${origin}\nwhitelist: ${JSON.stringify(
              whitelist
            )}`
          );
          HttpError.BadRequest();
        }
      } else {
        response.headers = {
          ...response.headers,
          'Access-Control-Allow-Origin': '*',
        };
      }
    }

    if (headers) {
      const copy = cloneDeep(headers);

      if (cors) {
        delete copy['Access-Control-Allow-Origin'];
      }

      // example headers:
      // 'Access-Control-Allow-Credentials': true,
      // 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
      response.headers = {
        ...response.headers,
        ...copy,
      };
    }

    if (body instanceof Object) {
      response.body = JSON.stringify(body);
    }

    if (typeof body === 'string') {
      response.body = body;
    }

    return response;
  } catch (error) {
    console.info(error);
    // error may need cors enabled
    if (error instanceof HttpError) return error;
    return {
      statusCode: 500,
    };
  }
}

// Refactor ideas
//
// export function apiResponse(config = {}) {
//   const {
//     statusCode = 200,
//     cors = false,
//     event,
//     whitelist,
//     headers = {},
//     body,
//   } = config;

//   try {
//     const hasEvent = event?.constructor?.name === 'Object';
//     const hasWhitelist = whitelist instanceof Array && whitelist.length > 0;
//     const hasHeaders = headers?.constructor?.name === 'Object';
//     let response = {
//       statusCode,
//     };

//     if (hasHeaders) {
//       response = { ...response, headers };
//     }

//     if (hasEvent && hasWhitelist) {
//       const origin = event?.headers?.origin ?? '';
//       const validOrigin = origin && whitelist.includes(origin);

//       if (!validOrigin) {
//         console.info(
//           `request origin not in whitelist\norigin: ${origin}\nwhitelist: ${JSON.stringify(
//             whitelist
//           )}`
//         );

//         HttpError.badRequest();
//       }

//       response = enableCors(response, origin);
//     } else if (cors) {
//       response = enableCors(response);
//     }

//     if (body) {
//       response = { ...response, body: getBody() };
//     }

//     return response;
//   } catch (error) {
//     console.info(error);

//     if (error instanceof HttpError) return cors ? enableCors(error) : error;

//     const response = new HttpError();

//     return cors ? enableCors(response) : response;
//   }

//   function enableCors(response, origin) {
//     return {
//       ...response,
//       headers: {
//         ...(response?.headers ?? {}),
//         'Access-Control-Allow-Origin': origin ? origin : '*',
//       },
//     };
//   }

//   function getBody() {
//     if (body?.constructor?.name === 'Object' || body instanceof Array) {
//       return JSON.stringify(body);
//     }

//     if (typeof body === 'string') {
//       return body;
//     }
//   }
// }

function validateApiResponseConfig(config) {
  const { statusCode = 200, cors = false, event, whitelist, headers } = config;

  if (typeof statusCode !== 'number')
    throw new Error('statusCode config must be a number');

  if (typeof cors !== 'boolean')
    throw new Error('cors config must be a boolean');

  if (headers && headers.constructor.name !== 'Object')
    throw new Error('headers config must be an object');

  if (
    whitelist &&
    (!(whitelist instanceof Array) ||
      whitelist.some((item) => typeof item !== 'string'))
  )
    throw new Error('whitelist config must be an array of strings');

  if (
    event &&
    (event.constructor.name !== 'Object' ||
      typeof event?.headers?.origin !== 'string')
  )
    throw new Error('event config must be api gateway event');
}
