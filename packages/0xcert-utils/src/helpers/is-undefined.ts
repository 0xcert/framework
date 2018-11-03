/**
 * Returns `true` if the provided value is undefined.
 * @param v Arbitrary value.
 */
export function isUndefined(v?: any) {
  return typeof v === 'undefined' || v === undefined;
}
