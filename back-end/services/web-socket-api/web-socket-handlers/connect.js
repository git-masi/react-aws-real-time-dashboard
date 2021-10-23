import { addConnection } from '../db/connections';
import { WsResponse } from '../utils/wsMessage';

export const handler = connect;

async function connect(event) {
  console.info(event);
  const connectionItem = createConnectionItem(event);

  try {
    await addConnection(connectionItem);

    console.info(
      `New web socket connection ${connectionItem.connectionId} from origin ${connectionItem.requestOrigin} added`
    );

    return WsResponse.success();
  } catch (error) {
    console.info(error);
    return WsResponse.serverError();
  }
}

function createConnectionItem(event) {
  const {
    headers: { Origin: origin },
    requestContext: { connectionId, connectedAt, domainName, authorizer },
  } = event;

  const item = {
    connectionId,
    connectedAt: new Date(connectedAt).toISOString(),
    requestOrigin: origin,
    requestDomain: domainName,
    storeId: authorizer.principalId,
  };

  return item;
}
