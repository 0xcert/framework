import { GenericProvider } from "@0xcert/ethereum-generic-provider";
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string, assetId: string) {
  return {
    id: assetId,
    uri: await provider.queryContract({
      to: ledgerId,
      abi: xcertAbi.find((a) => a.name === 'tokenURI'),
      data: [assetId],
      tag: 'latest',
    }).then((r) => r[0]),
    proof: await provider.queryContract({
      to: ledgerId,
      abi: xcertAbi.find((a) => a.name === 'tokenProof'),
      data: [assetId],
      tag: 'latest',
    }).then((r) => r[0]),
  };
}
