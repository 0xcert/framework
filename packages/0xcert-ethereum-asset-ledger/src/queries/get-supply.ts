import { encodeFunctionCall, decodeParameters } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'totalSupply' && a.type === 'function'
));

/**
 * Gets the amount of assets than exist in this asset ledger.
 */
export default async function(ledger: AssetLedger) {
  const attrs = {
    to: ledger.id,
    data: encodeFunctionCall(abi, []),
  };
  const res = await ledger.provider.send({
    method: 'eth_call',
    params: [attrs, 'latest'],
  });
  return decodeParameters(abi.outputs, res.result)[0];
}
