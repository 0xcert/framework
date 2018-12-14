import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { ValueLedger } from '../core/ledger';
import erc20Abi from '../config/erc20-abi';

/**
 * Smart contract approve abi.
 */
const abi = erc20Abi.find((a) => (
  a.name === 'approve' && a.type === 'function'
));

/**
 * Approves an account for transfering an amount of tokens.
 * @param ledger Value ledger instance.
 * @param accountId Account address.
 * @param value Amount of tokens.
 */
export default async function(ledger: ValueLedger, accountId: string, value: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: encodeFunctionCall(abi, [accountId, value]),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
