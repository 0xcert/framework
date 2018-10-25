import { isNumber } from './is-number';

/**
 * Returns `true` if the provided value is a number.
 * @param v Arbitrary value.
 */
export function isFloat(v?: any) {
  return (
    isNumber(v)
    && isFinite(v)
  );
}
