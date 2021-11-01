import { name, commerce } from 'faker';
import { randomInt } from 'd3-random';
import { addOrder } from '../../http/db/orders';

const TEST_STORE_ID = '98765';

export const handler = createFakeOrders;

async function createFakeOrders() {
  try {
    const order = {
      firstName: name.firstName(),
      lastName: name.lastName(),
      items: createItems(),
      storeId: TEST_STORE_ID,
    };
    order.total = order.items.reduce((acc, item) => acc + item.price, 0);

    await addOrder(order);
  } catch (error) {
    console.info(error);
  }
}

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