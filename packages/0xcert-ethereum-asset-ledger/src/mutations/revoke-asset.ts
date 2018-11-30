import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'revoke' && a.type === 'function'
));

/**
 * Destroys an asset the same way as destoryAsset does but only an account with revoke ability can
 * call it.
 */
export default async function(ledger: AssetLedger, assetId: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: encodeFunctionCall(abi, [assetId]),
    gas: 6000000,
  };
  const res = await ledger.provider.send({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
