import { isArray } from './is-array';
import { isUndefined } from './is-undefined';
import { isNull } from './is-null';
import { isValue } from './is-value';

/**
 * Converts the provided value to array.
 * @param v Arbitrary value.
 */
export function toArray(v?: any): Array<any> {
  if (isArray(v)) {
    return v;
  } else if (isUndefined(v) || isNull(v)) {
    return null;
  } else if (!isValue(v)) {
    return [];
  } else {
    return [v];
  }
}
