import { GenericProvider } from "@0xcert/ethereum-generic-provider";
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string, accountId: string) {
  return provider.queryContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'balanceOf'),
    data: [accountId],
    tag: 'latest',
  }).then((r) => parseInt(r[0]));
}
