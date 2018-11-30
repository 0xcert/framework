import { GenericProvider } from "@0xcert/ethereum-generic-provider";
import xcertAbi from '../config/xcertAbi';

/**
 * Gets asset ledger information (name, symbol, uriBase, conventionId).
 */
export default async function(provider: GenericProvider, ledgerId: string) {
  return {
    name: await provider.queryContract({
      to: ledgerId,
      abi: xcertAbi.find((a) => a.name === 'name'),
      tag: 'latest',
    }).then((r) => r[0]),
    symbol: await provider.queryContract({
      to: ledgerId,
      abi: xcertAbi.find((a) => a.name === 'symbol'),
      tag: 'latest',
    }).then((r) => r[0]),
    uriBase: await provider.queryContract({
      to: ledgerId,
      abi: xcertAbi.find((a) => a.name === 'uriBase'),
      tag: 'latest',
    }).then((r) => r[0]),
    conventionId: await provider.queryContract({
      to: ledgerId,
      abi: xcertAbi.find((a) => a.name === 'conventionId'),
      tag: 'latest',
    }).then((r) => r[0]),
  };
}
