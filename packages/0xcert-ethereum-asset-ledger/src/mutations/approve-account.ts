import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string, accountId: string, tokenId: string) {
  return provider.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'approve'),
    data: [accountId, tokenId],
  });
}
