import { WsResponse } from '../utils/wsMessage';

export const handler = defaultHandler;

async function defaultHandler(event) {
  try {
    console.info(event);
    return WsResponse.success();
  } catch (error) {
    console.info(error);
    return WsResponse.serverError();
  }
}
