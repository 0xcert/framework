import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0xaca910e7';
const inputTypes = ['address', 'uint256', 'bool'];

/**
 * Revokes(removes) abilities from account.
 * @param ledger Asset ledger instance.
 * @param accountId Address of the account for which abilities will be revoked.
 * @param abilities Abilities as number representing bitfield.
 * @param allowSuperRevoke Additional check that prevents you from removing your own super ability by mistake.
 */
export default async function(ledger: AssetLedger, accountId: string, abilities: string, allowSuperRevoke: boolean) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [accountId, abilities, allowSuperRevoke]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
