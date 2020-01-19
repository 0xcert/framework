import { Mutation } from '@0xcert/ethereum-generic-provider';
import { ValueLedger } from '../core/ledger';

const functionSignature = '0x095ea7b3';
const inputTypes = ['address', 'uint256'];

/**
 * Approves an account for transferring an amount of tokens.
 * @param ledger Value ledger instance.
 * @param accountId Account address.
 * @param value Amount of tokens.
 */
export default async function(ledger: ValueLedger, accountId: string, value: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [accountId, value]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
