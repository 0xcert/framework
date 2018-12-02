/**
 * 
 * @see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
 */
export function normalizeAddress(address) {
  if (!address) {
    return address;
  }
  else {
    return address.toLowerCase();
  }
}
