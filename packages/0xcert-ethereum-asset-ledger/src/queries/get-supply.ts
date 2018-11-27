import { Connector } from "@0xcert/ethereum-connector";
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(connector: Connector, ledgerId: string) {
  return connector.queryContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'totalSupply'),
    tag: 'latest',
  }).then((r) => parseInt(r[0]));
}
