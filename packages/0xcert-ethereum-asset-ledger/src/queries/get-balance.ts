import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'balanceOf' && a.type === 'function'
));

/**
 * Gets the amount of assets the account owns.
 */
export default async function(ledger: AssetLedger, accountId: string) {
  const attrs = {
    to: ledger.id,
    data: encodeFunctionCall(abi, [accountId]),
  };
  const res = await ledger.provider.post({
    method: 'eth_call',
    params: [attrs, 'latest'],
  });
  return decodeParameters(abi.outputs, res.result)[0];
}
