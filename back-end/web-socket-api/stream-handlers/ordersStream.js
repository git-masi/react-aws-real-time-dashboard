import { DynamoDB } from 'aws-sdk';
import { isEmpty } from '../utils/data';
import { sendWebsocketMessage } from '../utils/wsMessage';

export const handler = ordersStream;

async function ordersStream(event) {
  const { newRecord, oldRecord } = getRecordData(event);
  console.log(newRecord);
  console.log(oldRecord);

  if (didStatusChange(newRecord, oldRecord)) {
    sendWebsocketMessage('connection id', 'some kind of message');
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
