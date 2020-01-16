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
        actionsOrderId: '0x0000000000000000000000000000000000000000',
        assetLedgerDeployOrderId: '0x0000000000000000000000000000000000000000',
        valueLedgerDeployOrderId: '0x0000000000000000000000000000000000000000',
      };
    case NetworkKind.TESTNET:
      return {
        actionsOrderId: '0x52FF43a24d7046ce8EA3DcFBDb758e564853b794',
        assetLedgerDeployOrderId: '0x1A549658F98ffDdc2fd5ce774205e0343F332b5a',
        valueLedgerDeployOrderId: '0x3314c6003fe4e76E3a73001A000c59179D0F3239',
      };
    default:
      throw new Error('Unsupported network kind.');
  }
}
