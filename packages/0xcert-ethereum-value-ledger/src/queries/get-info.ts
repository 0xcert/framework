import { Connector } from "@0xcert/ethereum-connector";
import erc20Abi from '../config/erc20Abi';

/**
 * 
 */
export default async function(connector: Connector, ledgerId: string) {
  return {
    name: await connector.queryContract({
      to: ledgerId,
      abi: erc20Abi.find((a) => a.name === 'name'),
      tag: 'latest',
    }).then((r) => r[0]),
    symbol: await connector.queryContract({
      to: ledgerId,
      abi: erc20Abi.find((a) => a.name === 'symbol'),
      tag: 'latest',
    }).then((r) => r[0]),
    decimals: await connector.queryContract({
      to: ledgerId,
      abi: erc20Abi.find((a) => a.name === 'decimals'),
      tag: 'latest',
    }).then((r) => parseInt(r[0])),
  };
}
