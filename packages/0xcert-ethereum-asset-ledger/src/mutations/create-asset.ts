import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import xcertAbi from '../config/xcertAbi';

/**
 * Creates a new asset an gives ownership to the specifies account.
 */
export default async function(provider: GenericProvider, ledgerId: string, accountId: string, assetId: string, proof: string) {
  return provider.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'mint'),
    data: [accountId, assetId, proof],
  });
}
