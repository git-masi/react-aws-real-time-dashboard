import { DynamoDB } from 'aws-sdk';

const defaultDocumentClient = new DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
});

export const dynamoDb = {
  transactWrite(params, documentClient = defaultDocumentClient) {
    return documentClient.transactWrite(params).promise();
  },
  query(params, documentClient = defaultDocumentClient) {
    return documentClient.query(params).promise();
  },
  put(params, documentClient = defaultDocumentClient) {
    return documentClient.put(params).promise();
  },
  delete(params, documentClient = defaultDocumentClient) {
    return documentClient.delete(params).promise();
  },
};

// Expected input -> [{ TransactItems: [...] }, { TransactItems: [...] }]
export function assembleTransactionParams(arr) {
  return arr.reduce(
    (acc, param) => {
      acc.TransactItems = [...acc.TransactItems, ...param.TransactItems];
      return acc;
    },
    { TransactItems: [] }
  );
}

// Expected input -> [TABLE_NAME, { HASH_KEY_NAME: x, RANGE_KEY_NAME: y }, {ATTRIBUTE: a, ANOTHER_ATTRIBUTE: b}], ...
export function createUpdateTransactionParams(...data) {
  if (!isDataValid)
    throw new Error('Invalid data passed to createUpdateTransactionParams');

  const items = data.map(mapUpdateItems);
  return {
    TransactItems: items,
  };

  function isDataValid() {
    return (
      data instanceof Array &&
      data.every(
        (arr) =>
          arr instanceof Array &&
          arr.length === 3 &&
          typeof arr[0] === 'string' &&
          arr?.[1]?.constructor.name === 'Object' &&
          arr?.[2]?.constructor.name === 'Object'
      )
    );
  }

  function mapUpdateItems([tableName, key, updates]) {
    const accumulator = ['set', {}, {}];
    const [expression, names, values] = Object.entries(updates).reduce(
      reduceUpdateEntries,
      accumulator
    );
    const update = {
      TableName: tableName,
      Key: key,
      UpdateExpression: expression,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    };
    return {
      Update: update,
    };

    function reduceUpdateEntries(acc, entry, index) {
      const [expression, names, values] = acc;
      const [key, value] = entry;

      const attName = `#${key}`;
      const valName = `:${key}`;

      const newExpression = `${expression}${
        index > 0 ? ',' : ''
      } ${attName} = ${valName}`;
      const newNames = { ...names, [attName]: key };
      const newValues = { ...values, [valName]: value };

      return [newExpression, newNames, newValues];
    }
  }
}

// Expected input -> [TABLE_NAME, { x: y, ... }], [ANOTHER_TABLE_NAME, { a: b, ... }], ...
export function createWriteTransactionParams(...data) {
  if (!isDataValid)
    throw new Error('Invalid data passed to createWriteTransactionParams');

  const items = data.map(([tableName, item]) => ({
    Put: { TableName: tableName, Item: item },
  }));

  return {
    TransactItems: items,
  };

  function isDataValid() {
    return (
      data instanceof Array &&
      data.every(
        (arr) =>
          arr instanceof Array &&
          arr.length === 2 &&
          typeof arr[0] === 'string' &&
          arr?.[1]?.constructor.name === 'Object'
      )
    );
  }
}

export function getFirstItem(dbResult) {
  const { Items, Item } = dbResult;
  const result = Items?.[0] ?? Item ?? null;
  return result;
}

export function getItems(dbResult) {
  const { Items, Item } = dbResult;
  const result = Items ?? Item ?? null;
  return result;
}
