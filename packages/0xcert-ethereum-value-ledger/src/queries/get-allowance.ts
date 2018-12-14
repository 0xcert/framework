import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { ValueLedger } from '../core/ledger';
import erc20Abi from '../config/erc20-abi';

/**
 * Smart contract allowance abi.
 */
const abi = erc20Abi.find((a) => (
  a.name === 'allowance' && a.type === 'function'
));

/**
 * Gets the amount of tokens an account approved for usage to another account.
 * @param ledger Value ledger instance.
 * @param accountId Token owner account id.
 * @param spenderId Approved spender account id.
 */
export default async function(ledger: ValueLedger, accountId: string, spenderId: string) {
  try {
    const attrs = {
      to: ledger.id,
      data: encodeFunctionCall(abi, [accountId, spenderId]),
    };
    const res = await ledger.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return decodeParameters(abi.outputs, res.result)[0];
  } catch (error) {
    return null;
  }
}
