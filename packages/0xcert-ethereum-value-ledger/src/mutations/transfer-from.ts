import { Mutation } from '@0xcert/ethereum-generic-provider';
import { ValueLedger } from '../core/ledger';

const functionSignature = '0x23b872dd';
const inputTypes = ['address', 'address', 'uint256'];

/**
 * Transfers tokens that you have been approved from.
 * @param ledger Value ledger instance.
 * @param senderId Address of the token owner.
 * @param receiverId Address of the receiver.
 * @param value Amount of tokens.
 */
export default async function(ledger: ValueLedger, senderId: string, receiverId: string, value: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [senderId, receiverId, value]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
