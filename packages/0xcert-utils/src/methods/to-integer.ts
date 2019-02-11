/**
 * Converts numeric values to integer.
 */
export function toInteger(val: number | string | boolean) {
  if (typeof val === 'number' && val > Number.MAX_SAFE_INTEGER) {
    return 0;
  } else if (typeof val === 'boolean' && val === true) {
    return 1;
  } else {
    return parseInt(`${val}`) || 0;
  }
}
