import * as jssha3 from 'js-sha3';

/**
 * Converts a message into KECCAK hash.
 * @param bits Number of bits (224, 256, 384 or 512).
 * @param message Text message.
 */
export function keccak(bits: number, message: string) {
  return jssha3[`keccak_${bits}`](message);
}
