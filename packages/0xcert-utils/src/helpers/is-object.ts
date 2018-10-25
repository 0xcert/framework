import { isUndefined } from './is-undefined';
import { isNull } from './is-null';

/**
 * Returns `true` if the provided value is an object.
 * @param v Arbitrary value.
 */
export function isObject(v?: any) {
  return (
    !isUndefined(v)
    && !isNull(v)
    && v.constructor === Object
  );
}
