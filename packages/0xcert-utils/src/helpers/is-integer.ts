import { isNumber } from './is-number';

/**
 * Returns `true` if the provided value represents an integer number.
 * @param v Arbitrary value.
 */
export function isInteger(v?: any) {
  return isNumber(v) ? v % 1 === 0 : false;
}
