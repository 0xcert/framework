import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import { AssetLedgerAbility } from '@0xcert/scaffold';

const functionSignature = '0x99841855';
const inputTypes = ['address', 'uint8[]'];

/**
 * Revokes(removes) abilities from account.
 * @param ledger Asset ledger instance.
 * @param accountId Address of the account for which abilities will be revoked.
 * @param abilities List of the abilities.
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
  });
  return new Mutation(ledger.provider, res.result);
}
