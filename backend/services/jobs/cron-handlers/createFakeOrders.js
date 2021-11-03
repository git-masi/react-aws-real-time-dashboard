import { name, commerce } from 'faker';
import { randomInt } from 'd3-random';
import { createWriteTransactionParams, dynamoDb } from '../../../utils/dynamo';
import { orderStatuses, pkValues } from '../../../utils/constants';
import { readAllClients } from '../../../utils/clients';

const { MAIN_TABLE_NAME } = process.env;

export const handler = createFakeOrders;

async function createFakeOrders() {
  try {
    const clients = await readAllClients();
    const batches = batchClients(clients);
    const batchedParams = batches.map(buildDbTransactionParams);
    const updateResults = await Promise.allSettled(
      batchedParams.map((params) => dynamoDb.transactWrite(params))
    );

    console.info(updateResults); // todo: error handling if an update fails

    function batchClients(clients, batches = []) {
      if (clients.length <= 25) return [...batches, clients];

      const batch = clients.slice(0, 25);

      return batchClients(clients.slice(25), [...batches, batch]);
    }

    function buildDbTransactionParams(batch) {
      const orders = batch.map((client) => [
        MAIN_TABLE_NAME,
        buildNewOrder(client.clientId),
      ]);

      return createWriteTransactionParams(...orders);
    }
  } catch (error) {
    console.info(error);
  }

  function buildNewOrder(clientId) {
    const items = createItems();
    const created = new Date().toISOString();
    const sk = `${created}#${clientId}`;
    const order = {
      firstName: name.firstName(),
      lastName: name.lastName(),
      items,
      clientId,
      total: items.reduce((acc, item) => acc + item.price, 0),
      pk: pkValues.order,
      sk,
      created,
      status: orderStatuses.open,
    };

    return order;

    function createItems() {
      const maxFive = randomInt(1, 5);
      const numItems = maxFive();
      const items = [];

      for (let i = 0; i < numItems; i++) {
        const quantity = maxFive();
        const unitPrice = randomInt(549, 99999)();
        const item = {
          name: commerce.productName(),
          description: commerce.productDescription(),
          quantity,
          price: quantity * unitPrice,
        };

        items.push(item);
      }

      return items;
    }
  }
}
