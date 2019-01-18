import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0xf85aa211';
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
    data: functionSignature + encodeParameters(inputTypes, [accountId, abilities]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  })
  return new Mutation(ledger.provider, res.result);
}
