export function titleCase(str) {
  const split = str.replace(/([A-Z]+)*([A-Z][a-z])/g, '$1 $2');
  return split.substring(0, 1).toUpperCase() + split.substring(1);
}
