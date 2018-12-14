import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { ValueLedger } from '../core/ledger';
import erc20Abi from '../config/erc20-abi';

/**
 * Smart contract balanceOf abi.
 */
const abi = erc20Abi.find((a) => (
  a.name === 'balanceOf' && a.type === 'function'
));

/**
 * Gets the amount of token an account owns.
 * @param ledger Value ledger instance.
 * @param accountId Account address.
 */
export default async function(ledger: ValueLedger, accountId: string) {
  try {
    const attrs = {
      to: ledger.id,
      data: encodeFunctionCall(abi, [accountId]),
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
