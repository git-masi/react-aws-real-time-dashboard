import { addConnection } from '../db/connections';
import { WsResponse } from '../utils/wsMessage';

export const handler = connect;

async function connect(event) {
  console.info(event);
  const connection = buildConnection();

  try {
    await addConnection(connection);

    console.info(
      `New web socket connection ${connection.connectionId} from origin ${connection.requestOrigin} added`
    );

    return WsResponse.success();
  } catch (error) {
    console.info(error);
    return WsResponse.serverError();
  }

  function buildConnection() {
    const {
      headers: { Origin: origin },
      requestContext: { connectionId, connectedAt, domainName, authorizer },
    } = event;
    const clientId = authorizer.principalId;

    return {
      connectionId,
      connectedAt: new Date(connectedAt).toISOString(),
      requestOrigin: origin,
      requestDomain: domainName,
      clientId,
    };
  }
}
