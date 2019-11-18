import { bigNumberify as toBN } from 'ethers/utils/bignumber';
export { BigNumber } from 'ethers/utils/bignumber';

/**
 * Converts arbitrary number to a BigNumber format.
 * @param value Arbitrary number.
 */
export function bigNumberify(value: any) {
  return toBN(value);
}
