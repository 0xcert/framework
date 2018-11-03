import { isUndefined } from './is-undefined';
import { isNull } from './is-null';
import { isString } from './is-string';

/**
 * Converts the provided value to string.
 * @param v Arbitrary value.
 */
export function toString(v?: any) {
  if (isString(v)) {
    return v;
  } else if (isUndefined(v) || isNull(v)) {
    return null;
  } else {
    return toString(v.toString());
  }
}
