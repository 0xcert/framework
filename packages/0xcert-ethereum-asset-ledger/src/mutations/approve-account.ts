import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import xcertAbi from '../config/xcertAbi';

/**
 * Approves an account for transfering a specific token.
 */
export default async function(provider: GenericProvider, ledgerId: string, accountId: string, assetId: string) {
  return provider.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'approve'),
    data: [accountId, assetId],
  });
}
