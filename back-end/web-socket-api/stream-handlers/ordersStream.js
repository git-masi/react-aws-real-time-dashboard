import { DynamoDB } from 'aws-sdk';
import { getItems } from '../../http-api/db/shared';
import { getConnectionsByStore } from '../db/connections';
import { isEmpty } from '../utils/data';
import { sendWebsocketMessage } from '../utils/wsMessage';

export const handler = ordersStream;

async function ordersStream(event) {
  const { newRecord, oldRecord } = getRecordData(event);
  // delete after testing
  console.log(newRecord);
  console.log(oldRecord);

  if (didStatusChange(newRecord, oldRecord)) {
    const connections = getItems(
      await getConnectionsByStore(newRecord.storeId)
    );

    await sendStatusUpdateMessages(connections);
  }

  function sendStatusUpdateMessages(connections) {
    const promises = connections.map(({ connectionId, pk, status }) => {
      console.info(
        'Sending status change message via websocket\n',
        'connectionId',
        connectionId,
        'pk',
        pk,
        'status',
        status
      );

      return sendWebsocketMessage(connectionId, JSON.stringify({ pk, status }));
    });

    return Promise.all(promises);
  }
}

function getRecordData(event) {
  const { Records } = event;
  const dynamoRecord = Records[0]?.dynamodb;
  const { NewImage = {}, OldImage = {} } = dynamoRecord;

  const converter = DynamoDB.Converter;

  const newRecord = converter.unmarshall(NewImage);
  const oldRecord = converter.unmarshall(OldImage);

  return { newRecord, oldRecord };
}

function didStatusChange(newRecord, oldRecord) {
  if (isEmpty(oldRecord)) return false;

  return newRecord?.status === oldRecord?.status;
}
