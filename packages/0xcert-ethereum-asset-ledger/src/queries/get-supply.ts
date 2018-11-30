import { encodeFunctionCall, decodeParameters } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * Gets the amount of assets than exist in this asset ledger.
 */
export default async function(ledger: AssetLedger) {

  const abi = xcertAbi.find((a) => (
    a.name === 'totalSupply' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_call',
    params: [
      {
        to: ledger.id,
        data: encodeFunctionCall(abi, []),
      },
      'latest'
    ],
  }).then(({ result }) => {
    return decodeParameters(abi.outputs, result);
  }).then((r) => {
    return parseInt(r[0]);
  });
}
