import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import erc20Abi from '../config/erc20Abi';
import { BN } from '../core/utils';


/**
 * 
 */
export default async function(provider: GenericProvider, ledgerId: string, accountId: string, amount: BN) {
  return provider.mutateContract({
    to: ledgerId,
    abi: erc20Abi.find((a) => a.name === 'approve'),
    data: [accountId, amount.toString()],
  });
}