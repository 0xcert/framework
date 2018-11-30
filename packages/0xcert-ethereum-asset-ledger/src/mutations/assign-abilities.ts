import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerAbility } from "@0xcert/scaffold";
import xcertAbi from '../config/xcertAbi';

/**
 * Assigns abilities to an account.
 */
export default async function(provider: GenericProvider, ledgerId: string, accountId: string, abilities: AssetLedgerAbility[]) {
  return provider.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'assignAbilities'),
    data: [accountId, abilities],
  });
}
