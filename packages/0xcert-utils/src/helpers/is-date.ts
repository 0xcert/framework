import { isUndefined } from './is-undefined';
import { isNull } from './is-null';
import { isInteger } from './is-integer';

/**
 * Returns `true` if the provided value is a Date object.
 * @param v Arbitrary value.
 */
export function isDate(v?: any) {
  return (
    !isUndefined(v)
    && !isNull(v)
    && v.constructor === Date
    && isInteger(v.getTime())
  );
}
