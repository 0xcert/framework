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
      actionsOrderId: '0x8a85cA5ED516DA0f235647222e89CEfeF85F53e4',
      assetLedgerDeployOrderId: '0x20337208647bB73b706D435c86F31cd5897bB24c',
      valueLedgerDeployOrderId: '0x9a0bB454D50c7281562cD75311412E1a7D1375AF',
    };
  case NetworkKind.TESTNET:
    return {
      actionsOrderId: '0x7b65B89Dd2b43229E8BD087fA1601805d571b57D',
      assetLedgerDeployOrderId: '0x121ab5e82cdA136e4632268956d4227696D2F5e7',
      valueLedgerDeployOrderId: '0xE18a943ab808B69A5da445de844932f5f267baA0',
    };
  default:
    throw new Error('Unsupported network kind.');
  }
}
