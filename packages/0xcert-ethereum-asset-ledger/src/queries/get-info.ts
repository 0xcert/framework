import { Connector } from "@0xcert/ethereum-connector";
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(connector: Connector, ledgerId: string) {
  return {
    name: await connector.queryContract({
      to: ledgerId,
      abi: xcertAbi.find((a) => a.name === 'name'),
      tag: 'latest',
    }).then((r) => r[0]),
    symbol: await connector.queryContract({
      to: ledgerId,
      abi: xcertAbi.find((a) => a.name === 'symbol'),
      tag: 'latest',
    }).then((r) => r[0]),
    uriBase: await connector.queryContract({
      to: ledgerId,
      abi: xcertAbi.find((a) => a.name === 'uriBase'),
      tag: 'latest',
    }).then((r) => r[0]),
    conventionId: await connector.queryContract({
      to: ledgerId,
      abi: xcertAbi.find((a) => a.name === 'conventionId'),
      tag: 'latest',
    }).then((r) => r[0]),
  };
}
