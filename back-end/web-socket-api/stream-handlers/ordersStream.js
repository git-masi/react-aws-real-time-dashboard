import { DynamoDB } from 'aws-sdk';

export const handler = ordersStream;

async function ordersStream(event) {
  const { newRecord, oldRecord } = getRecordData(event);
  console.log(newRecord);
  console.log(oldRecord);
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
