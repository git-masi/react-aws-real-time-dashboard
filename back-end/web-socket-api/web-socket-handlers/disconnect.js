import { removeConnection } from '../db/connections';

export const handler = disconnect;

async function disconnect(event) {
  const {
    requestContext: { connectionId },
  } = event;

  try {
    await removeConnection(connectionId);

    console.info(
      `Removed connection ${connectionId} from the connections table`
    );
  } catch (error) {
    console.info(error);
  }
}
