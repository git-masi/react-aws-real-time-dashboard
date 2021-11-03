import { DynamoDB } from 'aws-sdk';
import { updatedDiff } from 'deep-object-diff';
import { getItems } from '../../../utils/dynamo';
import { getConnectionsByClient } from '../../../utils/connections';
import { isEmpty } from '../../../utils/data';
import { sendWebsocketMessage } from '../utils/wsMessage';

export const handler = ordersStream;

async function ordersStream(event) {
  const { newRecord, oldRecord } = getRecordData(event);
  const diff = updatedDiff(oldRecord, newRecord);

  console.info(`diff for ${oldRecord.pk}|${oldRecord.sk}:`, diff);

  if (
    isNewRecord(newRecord, oldRecord) ||
    didStatusChange(newRecord, oldRecord)
  ) {
    const connections = getItems(
      await getConnectionsByClient(newRecord.clientId)
    );

    await sendStatusUpdateMessages(connections, newRecord);
  }

  function sendStatusUpdateMessages(connections, order) {
    const promises = connections.map(({ connectionId }) => {
      console.info(
        'Sending status change message via websocket\n',
        'connectionId:',
        connectionId,
        '\npk:',
        order.pk,
        '\nsk:',
        order.sk,
        '\nstatus:',
        order.status
      );

      return sendWebsocketMessage(connectionId, JSON.stringify(order));
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

function isNewRecord(newRecord, oldRecord) {
  return isEmpty(oldRecord) && !isEmpty(newRecord);
}

function didStatusChange(newRecord, oldRecord) {
  if (isEmpty(oldRecord)) return false;

  return newRecord?.status !== oldRecord?.status;
}
