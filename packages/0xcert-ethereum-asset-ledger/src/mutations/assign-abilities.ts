import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerAbility } from "@0xcert/scaffold";
import { encodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0x78e57c1f';
const inputTypes = ['address', 'uint8[]'];

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
    data: functionSignature + encodeParameters(inputTypes, [accountId, abilities]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  })
  return new Mutation(ledger.provider, res.result);
}
