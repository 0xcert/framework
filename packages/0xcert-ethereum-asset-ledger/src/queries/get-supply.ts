import { GenericProvider } from "@0xcert/ethereum-generic-provider";
import xcertAbi from '../config/xcertAbi';

/**
 * Gets the amount of assets than exist in this asset ledger.
 */
export default async function(provider: GenericProvider, ledgerId: string) {
  return provider.queryContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'totalSupply'),
    tag: 'latest',
  }).then((r) => parseInt(r[0]));
}
