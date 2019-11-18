import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0xf394b6df';
const inputTypes = ['address', 'uint256'];

/**
 * Revokes(removes) abilities from account.
 * @param ledger Asset ledger instance.
 * @param accountId Address of the account for which abilities will be revoked.
 * @param abilities Abilities as number representing bitfield.
 */
export default async function(ledger: AssetLedger, accountId: string, abilities: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [accountId, abilities]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
