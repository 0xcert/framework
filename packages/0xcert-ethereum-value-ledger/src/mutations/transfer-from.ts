import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { ValueLedger } from '../core/ledger';
import erc20Abi from '../config/erc20-abi';

/**
 * Smart contract transferFrom abi.
 */
const abi = erc20Abi.find((a) => (
  a.name === 'transferFrom' && a.type === 'function'
));

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
    data: encodeFunctionCall(abi, [senderId, receiverId, value]),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
