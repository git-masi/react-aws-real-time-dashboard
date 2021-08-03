import { addConnection } from '../db/connections';

export const handler = connect;

async function connect(event) {
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

  try {
    await addConnection(item);

    console.info(
      `New web socket connection ${connectionId} from origin ${origin} added`
    );
  } catch (error) {
    console.info(error);
  }
}
