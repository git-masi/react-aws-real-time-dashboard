import { sendWebsocketMessage, WsResponse } from '../utils/wsMessage';

export const handler = keepAlive;

async function keepAlive(event) {
  try {
    const {
      requestContext: { connectionId },
      body,
    } = event;

    // Return the request body so the browser knows it's a keep alive message
    await sendWebsocketMessage(connectionId, body);

    return WsResponse.success();
  } catch (error) {
    console.info(error);
    return WsResponse.serverError();
  }
}
