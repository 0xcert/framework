import { normalizeAddress as normalizeEthereumAddress } from '@0xcert/ethereum-utils/dist/lib/normalize-address';

/**
 * Converts Wanchain address to checksum format.
 * NOTE: Wanchain uses basically the same mechanism, you only have to inverse
 * lower and upper case on characters.
 */
export function normalizeAddress(address: string): string {
  if (!address) {
    return null;
  }

  address = normalizeEthereumAddress(address.toLowerCase());

  return [
    '0x',
    ...address.substr(2).split('').map((character) => {
      return character == character.toLowerCase()
        ? character.toUpperCase()
        : character.toLowerCase();
    }),
  ].join('');
}
