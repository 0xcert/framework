import { encodeFunctionCall, decodeParameters } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * Gets the account that owns the specific asset.
 */
export default async function(ledger: AssetLedger, assetId: string) {

  const abi = xcertAbi.find((a) => (
    a.name === 'ownerOf' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_call',
    params: [
      {
        to: ledger.id,
        data: encodeFunctionCall(abi, [assetId]),
      },
      'latest'
    ],
  }).then(({ result }) => {
    return decodeParameters(abi.outputs, result);
  }).then((r) => {
    return r[0];
  });
}
