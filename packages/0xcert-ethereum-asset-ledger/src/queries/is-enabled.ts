import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'isPaused' && a.type === 'function'
));

/**
 * Checks if the transfer is enabled.
 * @param ledger Asset ledger instance.
 */
export default async function(ledger: AssetLedger) {
  const attrs = {
    to: ledger.id,
    data: encodeFunctionCall(abi, []),
  };
  const res = await ledger.provider.post({
    method: 'eth_call',
    params: [attrs, 'latest'],
  });
  return !decodeParameters(abi.outputs, res.result)[0]
}
