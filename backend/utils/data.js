export function isEmpty(value) {
  if (value === '') return true;

  if (value instanceof Array && value.length === 0) return true;

  if (value?.constructor?.name === 'Object')
    return Object.keys(value).length === 0;

  if ((value instanceof Set || value instanceof Map) && value.size === 0)
    return true;

  return false;
}
