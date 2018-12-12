import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerAbility } from "@0xcert/scaffold";
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'assignAbilities' && a.type === 'function'
));

/**
 * Assigns abilities to an account.
 * @param ledger Asset ledger instance.
 * @param accountId Account address.
 * @param abilities List of abilities.
 */
export default async function(ledger: AssetLedger, accountId: string, abilities: AssetLedgerAbility[]) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: encodeFunctionCall(abi, [accountId, abilities]),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  })
  return new Mutation(ledger.provider, res.result);
}
