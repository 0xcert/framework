/**
 * Returns `true` if the provided values are deeply equal.
 * @param a Value A.
 * @param b Value B.
 */
export function isDeepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a == null || typeof a != 'object' || b == null || typeof b != 'object') {
    return false;
  }
  let propsInA = 0;
  let propsInB = 0;

  for (const prop in a) {
    propsInA += 1;
  }

  for (const prop in b) {
    propsInB += 1;
    if (!(prop in a) || !isDeepEqual(a[prop], b[prop])) {
      return false;
    }
  }
  return propsInA == propsInB;
}
