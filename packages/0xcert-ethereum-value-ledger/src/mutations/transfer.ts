import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { ValueLedger } from '../core/ledger';
import erc20Abi from '../config/erc20-abi';

/**
 * Smart contract transfer abi.
 */
const abi = erc20Abi.find((a) => (
  a.name === 'transfer' && a.type === 'function'
));

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
    data: encodeFunctionCall(abi, [receiverId, value]),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
