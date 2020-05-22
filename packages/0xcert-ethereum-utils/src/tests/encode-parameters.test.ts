import { Spec } from '@hayspec/spec';
import { decodeParameters, encodeParameters } from '../lib/abi';
import { bigNumberify } from '../lib/big-number';

const spec = new Spec();

spec.test('encode parameters', (ctx) => {
  const types = ['tuple(uint256, uint256[])'];
  const values = [[ 42, [ 45 ] ]];
  const encoded = '0x' +
  '0000000000000000000000000000000000000000000000000000000000000020' +
  '000000000000000000000000000000000000000000000000000000000000002a' +
  '0000000000000000000000000000000000000000000000000000000000000040' +
  '0000000000000000000000000000000000000000000000000000000000000001' +
  '000000000000000000000000000000000000000000000000000000000000002d';

  ctx.is(
    encodeParameters(types, values),
    encoded,
  );

  // Testing function which compares values, even nested in a BigNumber
  // Source: https://github.com/ethers-io/ethers.js/blob/typescript/tests/test-contract-interface.js
  function equals(actual, expected) {

    // Array (treat recursively)
    if (Array.isArray(actual)) {
      if (!Array.isArray(expected) || actual.length !== expected.length) {
        return false;
      }
      for (let i = 0; i < actual.length; i++) {
        if (!equals(actual[i], expected[i])) {
          return false;
        }
      }
      return true;
    }

    if (typeof(actual) === 'number') {
      actual = bigNumberify(actual);
    }
    if (typeof(expected) === 'number') {
      expected = bigNumberify(expected);
    }

    // BigNumber
    if (actual.eq) {
      if (typeof(expected) === 'string' && expected.match(/^-?0x[0-9A-Fa-f]*$/)) {
        const neg = (expected.substring(0, 1) === '-');
        if (neg) {
          expected = expected.substring(1);
        }
        expected = bigNumberify(expected);
        if (neg) {
          expected = expected.mul(-1);
        }
      }
      if (!actual.eq(expected)) {
        return false;
      }
      return true;
    }

    // Something else
    return (actual === expected);
  }

  const result = decodeParameters(types, encoded);
  ctx.is(
    equals(result, values),
    true,
  );
});

export default spec;
