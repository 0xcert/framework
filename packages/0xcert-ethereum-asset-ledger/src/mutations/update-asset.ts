import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import xcertAbi from '../config/xcertAbi';

/**
 * Updates asset proof.
 */
export default async function(provider: GenericProvider, ledgerId: string, assetId: string, proof: string) {
  return provider.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'updateTokenProof'),
    data: [assetId, proof],
  });
}
