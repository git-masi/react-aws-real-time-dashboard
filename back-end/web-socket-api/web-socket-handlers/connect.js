import { addConnection } from '../db/connections';

export const handler = connect;

async function connect(event) {
  const connectionItem = createConnectionItem(event);

  try {
    await addConnection(connectionItem);

    console.info(
      `New web socket connection ${connectionItem.connectionId} from origin ${connectionItem.requestOrigin} added`
    );
  } catch (error) {
    console.info(error);
  }
}

function createConnectionItem(event) {
  const {
    headers: { Origin: origin },
    requestContext: { connectionId, connectedAt, domainName },
  } = event;

  const item = {
    connectionId,
    connectedAt: new Date(connectedAt).toISOString(),
    requestOrigin: origin,
    requestDomain: domainName,
  };

  return item;
}
