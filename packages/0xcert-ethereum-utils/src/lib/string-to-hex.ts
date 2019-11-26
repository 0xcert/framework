/**
 * Changes string to hex representation.
 * @param str String to change into hex.
 */
export function stringToHex(str: String) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}
