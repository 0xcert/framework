import * as Hash from 'eth-lib/src/hash';

/**
 * Generates keccak256 hash.
 */
export function keccak256(input: any) {
  return Hash.keccak256(input);
}
