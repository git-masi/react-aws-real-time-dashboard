import { nanoid } from 'nanoid';
import { createWriteTransactionParams } from '../../../utils/dynamo';
import { pkValues } from './mainTable';

export async function createClient() {
  const created = new Date().toISOString();
  const clientId = nanoid(8);
  const sk = `${created}#${clientId}`;
  const pk = pkValues.client;
  const client = { pk, sk, created, clientId };

  const params = createWriteTransactionParams([['table names goes here']]);
}
