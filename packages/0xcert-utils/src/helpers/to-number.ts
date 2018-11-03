import { toFloat } from './to-float';

/**
 * Converts the provided value to number (alias).
 * @param v Arbitrary value.
 */
export function toNumber(v?: any) {
  return toFloat(v);
}
