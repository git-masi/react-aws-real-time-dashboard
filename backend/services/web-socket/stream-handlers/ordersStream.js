import { DynamoDB } from 'aws-sdk';
import { updatedDiff } from 'deep-object-diff';
import { getItems } from '../../../utils/dynamo';
import { getConnectionsByClient } from '../../../utils/connections';
import { isEmpty } from '../../../utils/data';
import { sendWebsocketMessage } from '../utils/wsMessage';
import { pkValues } from '../../../utils/constants';

export const handler = ordersStream;

async function ordersStream(event) {
  const { newRecord, oldRecord } = getRecordData(event);

  if (!newRecord && !oldRecord) return;

  const diff = updatedDiff(oldRecord, newRecord);

  console.info(`diff for ${newRecord.pk}|${newRecord.sk}:`, diff);

  if (!newRecord.clientId || newRecord.pk !== pkValues.order) return;

  if (
    isNewRecord(newRecord, oldRecord) ||
    didStatusChange(newRecord, oldRecord)
  ) {
    try {
      const connections = getItems(
        await getConnectionsByClient(newRecord.clientId)
      );

      if (connections.length === 0) return;

      await sendStatusUpdateMessages(connections, newRecord);
    } catch (error) {
      console.info(error);
    }
  }

  function sendStatusUpdateMessages(connections, order) {
    const promises = connections.map(({ connectionId }) => {
      console.info(
        'Sending message via websocket\n',
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
  console.log(Records);
  const dynamoRecord = Records[0]?.dynamodb;
  const { NewImage = {}, OldImage = {} } = dynamoRecord;

  if (isEmpty(NewImage) && isEmpty(OldImage)) {
    return { newRecord: null, oldRecord: null };
  }

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
