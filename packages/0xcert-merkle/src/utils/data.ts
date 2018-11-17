/**
 * Converts any value to string.
 * @param val Arbitrary value.
 */
export function toString(val) {
  try {
    return typeof val === 'undefined' || val === null ? '' : `${val}`;
  } 
  catch (e) {
    return '';
  }
}
