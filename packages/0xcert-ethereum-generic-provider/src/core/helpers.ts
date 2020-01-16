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
    case NetworkKind.RINKEBY:
      return {
        actionsOrderId: '0x2e697eAcdCEc69A9695fb4908a35D04C80aB7E49',
        assetLedgerDeployOrderId: '0xBdd421cfD425BC952d704c2C68D902672FF7738D',
        valueLedgerDeployOrderId: '0xa5ff982d4b054F777DC3eFe77b5D91236A389800',
      };
    case NetworkKind.ROPSTEN:
      return {
        actionsOrderId: '0x265A62A3EfB677ca6A0F7C85dC5002EC71F2cde6',
        assetLedgerDeployOrderId: '0x2ED6fA578A0331Bcd598Ac0c43D26fe896b967c9',
        valueLedgerDeployOrderId: '0xd3bf7FF070a58A580D7ef82DF130DC0B06b567D8',
      };
    default:
      throw new Error('Unsupported network kind.');
  }
}
