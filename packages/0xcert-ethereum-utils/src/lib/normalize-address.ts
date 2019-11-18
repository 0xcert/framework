import { getAddress } from 'ethers/utils/address';

/**
 * Converts ethereum address to checksum format.
 * @see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
 */
export function normalizeAddress(address: string): string {
  return address ? getAddress(address.toLowerCase()) : null;
}
