import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0x0ab319e8';
const inputTypes = ['address', 'uint256'];

/**
 * Assigns abilities to an account.
 * @param ledger Asset ledger instance.
 * @param accountId Account address.
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
