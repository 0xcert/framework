import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'mint' && a.type === 'function'
));

/**
 * Creates a new asset an gives ownership to the specifies account.
 */
export default async function(ledger: AssetLedger, accountId: string, assetId: string, proof: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: encodeFunctionCall(abi, [accountId, assetId, proof]),
    gas: 6000000,
  };
  const res = await ledger.provider.send({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
