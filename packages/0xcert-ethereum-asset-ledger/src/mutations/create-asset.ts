import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'mint' && a.type === 'function'
));

/**
 * Creates a new asset and gives ownership to the specifies account.
 * @param ledger Asset ledger instance.
 * @param receiverId Address that will receive the new asset.
 * @param id Asset id.
 * @param imprint Imprint (merkle tree root) of the asset.
 */
export default async function(ledger: AssetLedger, receiverId: string, id: string, imprint: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: encodeFunctionCall(abi, [receiverId, id, imprint]),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
