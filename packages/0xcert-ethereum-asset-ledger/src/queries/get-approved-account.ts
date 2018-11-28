import { GenericProvider } from "@0xcert/ethereum-generic-provider";
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string, tokenId: string) {
  return provider.queryContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'getApproved'),
    data: [tokenId],
    tag: 'latest',
  }).then((r) => r[0]);
}
