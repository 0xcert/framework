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

  // We are using ethers.js for encoding ABI calls. This means that if we send using a Wanchain address,
  // ethers.js will throw an error. Ethers.js 5.0 with subclassing will be available in the following
  // weeks. Until then we just write the address in lowercase and let Ethers.js do its thing. Because of
  // this there is a danger of executing a transaction to an Ethereum address since there is no checksum check.

  return address.toLowerCase();

  // address = normalizeEthereumAddress(address.toLowerCase());

  // return [
  //   '0x',
  //   ...address.substr(2).split('').map((character) => {
  //   return character == character.toLowerCase()
  //      ? character.toUpperCase()
  //      : character.toLowerCase();
  //  }),
  // ].join('');*/
}
