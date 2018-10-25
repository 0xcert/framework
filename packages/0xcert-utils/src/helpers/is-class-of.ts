import { isPresent } from './is-present';

/**
 * Returns `true` if the provided value represents an subclass of a class.
 * @param v Arbitrary value.
 * @param k Class object.
 */
export function isClassOf(v?: any, k?: any) {
  try {
    return (
      isPresent(v)
      && isPresent(k)
      && (
        v.prototype instanceof k
        || v.prototype.constructor === k
      )
    );
  } catch (e) {
    return false;
  }
}
