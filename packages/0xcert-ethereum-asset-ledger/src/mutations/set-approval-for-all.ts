import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0xa22cb465';
const inputTypes = ['address', 'bool'];

/**
 * Sets approval for an account to have control over all assets.
 * @param ledger Asset ledger instance.
 * @param accountId Account id.
 * @param approved Is approved or not.
 */
export default async function(ledger: AssetLedger, accountId: string, approved: boolean) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [accountId, approved]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
