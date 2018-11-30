import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import xcertAbi from '../config/xcertAbi';

/**
 * Destroys an asset the same way as destoryAsset does but only an account with revoke ability can
 * call it.
 */
export default async function(provider: GenericProvider, ledgerId: string, assetId: string) {
  return provider.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'revoke'),
    data: [assetId],
  });
}
