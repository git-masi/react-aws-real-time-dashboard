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
