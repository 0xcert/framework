import { isPresent } from './is-present';

/**
 * Returns `true` if the provided value represents an instance of a class.
 * @param v Arbitrary value.
 * @param k Class object.
 */
export function isInstanceOf(v?: any, k?: any) {
  try {
    return (
      isPresent(v)
      && isPresent(k)
      && v instanceof k
    );
  } catch (e) {
    return false;
  }
}
