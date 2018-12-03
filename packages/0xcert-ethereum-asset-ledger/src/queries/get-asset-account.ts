import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'ownerOf' && a.type === 'function'
));

/**
 * Gets the account that owns the specific asset.
 */
export default async function(ledger: AssetLedger, assetId: string) {
  const attrs = {
    to: ledger.id,
    data: encodeFunctionCall(abi, [assetId]),
  };
  const res = await ledger.provider.post({
    method: 'eth_call',
    params: [attrs, 'latest'],
  });
  return decodeParameters(abi.outputs, res.result)[0];
}
