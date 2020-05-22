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
      actionsOrderId: '0x800ecA21614dA02Df076981Bca9c664dBE19089A',
      assetLedgerDeployOrderId: '0x984e781a6C09b433493767755f7b072183Ce7BfF',
      valueLedgerDeployOrderId: '0x9118bd4230EAb074f98527658f3649aA26420568',
    };
  case NetworkKind.RINKEBY:
    return {
      actionsOrderId: '0xF8254F1B119Cd263b066912B3Cb4FE568f580b6c',
      assetLedgerDeployOrderId: '0xC9F667603300390BCF8C4Fb5688d755811F34Da5',
      valueLedgerDeployOrderId: '0xA02121436e9307f9e369e188941b731D79c4DD7d',
    };
  case NetworkKind.ROPSTEN:
    return {
      actionsOrderId: '0xbb719e35c67198e4453923eeccF0c678C6129982',
      assetLedgerDeployOrderId: '0xC94284591B312c5551329F868420dec03C9044f8',
      valueLedgerDeployOrderId: '0xD348c4D9BE9585295891E0322FeFe58009c1514C',
    };
  default:
    throw new Error('Unsupported network kind.');
  }
}
