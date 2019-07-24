import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0x23b872dd';
const inputTypes = ['address', 'address', 'uint256'];

/**
 * Transfers asset from one account to another.
 * @param ledger Asset ledger instance.
 * @param receiverId Address that will receive the asset.
 * @param id Asset id.
 */
export default async function(ledger: AssetLedger, senderId: string, receiverId: string, id: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [senderId, receiverId, id]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
