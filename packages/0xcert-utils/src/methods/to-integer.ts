/**
 * Converts numeric values to integer.
 */
export function toInteger(val: number | string) {
  return parseInt(`${val}`) || 0;
}
