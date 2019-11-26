/**
 * Should be called to pad string to expected length
 * @note Based on: https://github.com/ethereum/web3.js/blob/1.0/packages/web3-utils/src/utils.js
 * @param string String to be padded.
 * @param chars Chars that result string should have.
 * @param sign Sign by default 0.
 * @param prefix Prefix by default calculated depending on input.
 */
export function leftPad(input: any, chars: number, sign?: string, prefix?: boolean) {
  const hasPrefix = prefix === undefined ? /^0x/i.test(input) || typeof input === 'number' : prefix;
  input = input.toString(16).replace(/^0x/i, '');
  const padding = (chars - input.length + 1 >= 0) ? chars - input.length + 1 : 0;

  return (hasPrefix ? '0x' : '') + new Array(padding).join(sign ? sign : '0') + input;
}
