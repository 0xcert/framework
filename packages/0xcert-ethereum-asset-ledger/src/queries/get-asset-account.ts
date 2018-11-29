import { GenericProvider } from "@0xcert/ethereum-generic-provider";
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string, assetId: string) {
  return provider.queryContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'ownerOf'),
    data: [assetId],
    tag: 'latest',
  }).then((r) => r[0]);
}
