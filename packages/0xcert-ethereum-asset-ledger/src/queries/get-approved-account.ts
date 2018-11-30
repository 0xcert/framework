import { GenericProvider } from "@0xcert/ethereum-generic-provider";
import xcertAbi from '../config/xcertAbi';

/**
 * Gets the account that is approved for transfering a specific asset.
 */
export default async function(provider: GenericProvider, ledgerId: string, assetId: string) {
  return provider.queryContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'getApproved'),
    data: [assetId],
    tag: 'latest',
  }).then((r) => r[0]);
}
