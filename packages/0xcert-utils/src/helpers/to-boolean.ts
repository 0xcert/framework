import { isBoolean } from './is-boolean';
import { isUndefined } from './is-undefined';
import { isNull } from './is-null';
import { isInfinite } from './is-infinite';

/**
 * Converts the provided value to boolean.
 * @param v Arbitrary value.
 */
export function toBoolean(v?: any) {
  if (isBoolean(v)) {
    return v;
  } else if (isUndefined(v) || isNull(v)) {
    return null;
  } else {
    return (
      parseFloat(v) > 0
      || isInfinite(v)
      || v === '1'
      || v === 'true'
      || v === 'yes'
      || v === '+'
    );
  }
}
