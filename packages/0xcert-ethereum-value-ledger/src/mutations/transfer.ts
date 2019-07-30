import { Mutation } from '@0xcert/ethereum-generic-provider';
import { ValueLedger } from '../core/ledger';

const functionSignature = '0xa9059cbb';
const inputTypes = ['address', 'uint256'];

/**
 * Transfers your tokens to another account.
 * @param ledger Value ledger instance.
 * @param receiverId Address of the receiver.
 * @param value Amount of tokens.
 */
export default async function(ledger: ValueLedger, receiverId: string, value: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [receiverId, value]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
