import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { ValueLedger } from '../core/ledger';
import erc20Abi from '../config/erc20-abi';

/**
 * Smart contract method abi.
 */
const abi = erc20Abi.find((a) => (
  a.name === 'allowance' && a.type === 'function'
));

/**
 * Gets the amount of assets the account owns.
 */
export default async function(ledger: ValueLedger, accountId: string, spenderId: string) {
  const attrs = {
    to: ledger.id,
    data: encodeFunctionCall(abi, [accountId, spenderId]),
  };
  const res = await ledger.provider.post({
    method: 'eth_call',
    params: [attrs, 'latest'],
  });
  return decodeParameters(abi.outputs, res.result)[0];
}
