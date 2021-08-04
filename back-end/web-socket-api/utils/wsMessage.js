// Modules
import { ApiGatewayManagementApi, Endpoint } from 'aws-sdk';

const WS_API_ENDPOINT = process.env.websocket_api_origin;

export class WsResponse {
  constructor(statusCode = 200, body) {
    this.statusCode = statusCode;
    this.headers = {
      'Content-Type': 'text/plain',
    };

    if (body) {
      this.body = body;
    }
  }

  static success(body) {
    return new WsResponse(200, body);
  }

  static serverError() {
    return new WsResponse(500, 'Something went wrong with the server');
  }
}

export async function sendWebsocketMessage(
  connectionId,
  message,
  domainName = null
) {
  const websocketManager = createManagementApi(domainName);

  const postParams = {
    Data: message,
    ConnectionId: connectionId,
  };

  return websocketManager.postToConnection(postParams).promise();
}

// domainName is OPTIONAL
//
// If passed the domainName should be an API Gateway execute-api url
//
// The execute-api url follows a pattern like this:
//    https://<api-id>.execute-api.<region>.amazonaws.com/<stage>
function createManagementApi(domainName) {
  return new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: domainName ?? createWebsocketApiEndpoint(),
  });
}

function createWebsocketApiEndpoint() {
  return new Endpoint(WS_API_ENDPOINT);
}
