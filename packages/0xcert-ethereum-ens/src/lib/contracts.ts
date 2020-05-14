import { NetworkKind } from '@0xcert/ethereum-generic-provider';

/**
 * Generates gateway config from deployed contract addresses.
 * @notice Configs will changes based on released version.
 * @param networkKind Ethereum network kind.
 */
export function getEnsAddress(networkKind: NetworkKind) {
  switch (networkKind) {
    case NetworkKind.LIVE:
      return '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
    case NetworkKind.RINKEBY:
      return '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
    case NetworkKind.ROPSTEN:
      return '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
    default:
      throw new Error('Unsupported network kind.');
  }
}
