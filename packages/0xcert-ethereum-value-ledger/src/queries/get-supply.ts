import { EthereumConnector } from "@0xcert/ethereum-connector";
import erc20Abi from '../config/erc20Abi';

/**
 * 
 */
export default async function(connector: EthereumConnector, ledgerId: string) {
  return connector.queryContract({
    to: ledgerId,
    abi: erc20Abi.find((a) => a.name === 'totalSupply'),
    tag: 'latest',
  }).then((r) => parseInt(r[0]));
}
