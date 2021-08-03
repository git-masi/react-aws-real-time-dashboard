import { nanoid } from 'nanoid';
import { addConnection } from '../db/connections';

export const handler = connect;

async function connect(event) {
  const {
    headers: { Origin },
    requestContext: { connectionId, connectedAt, domainName },
  } = event;

  const item = {
    id: nanoid(),
    connectionId,
    connectedAt: new Date(connectedAt).toISOString(),
    requestOrigin: Origin,
    requestDomain: domainName,
  };

  await addConnection(item);
}
