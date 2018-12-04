import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { ValueLedger } from '../core/ledger';
import erc20Abi from '../config/erc20Abi';

/**
 * Smart contract method abi.
 */
const abi = erc20Abi.find((a) => (
  a.name === 'transferFrom' && a.type === 'function'
));

/**
 * Approves an account for transfering an amount of tokens.
 */
export default async function(ledger: ValueLedger, senderId: string, receiverId: string, value: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: encodeFunctionCall(abi, [senderId, receiverId, value]),
    gas: 6000000,
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
