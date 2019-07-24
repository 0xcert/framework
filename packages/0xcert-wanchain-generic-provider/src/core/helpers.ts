import { NetworkKind } from './types';

/**
 * Generates gateway config from deployed contract addresses.
 * @notice Configs will changes based on released version.
 * @param networkKind Ethereum network kind.
 */
export function buildGatewayConfig(networkKind: NetworkKind) {
  switch (networkKind) {
    case NetworkKind.LIVE:
      return {
        multiOrderId: '0x0000000000000000000000000000000000000000',
        assetLedgerDeployOrderId: '0x0000000000000000000000000000000000000000',
        valueLedgerDeployOrderId: '0x0000000000000000000000000000000000000000',
      };
    case NetworkKind.TESTNET:
      return {
        multiOrderId: '0x0000000000000000000000000000000000000000',
        assetLedgerDeployOrderId: '0x0000000000000000000000000000000000000000',
        valueLedgerDeployOrderId: '0x0000000000000000000000000000000000000000',
      };
    default:
      throw new Error('Unsupported network kind.');
  }
}
