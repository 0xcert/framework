import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import xcertAbi from '../config/xcertAbi';

/**
 * Transfers asset from one account to another.
 */
export default async function(provider: GenericProvider, ledgerId: string, from: string, to: string, assetId: string) {
  return provider.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'transferFrom'),
    data: [from, to, assetId],
  });
}
