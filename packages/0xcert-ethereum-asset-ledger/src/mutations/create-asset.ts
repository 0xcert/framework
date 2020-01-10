import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0xb0e329e4';
const inputTypes = ['address', 'uint256', 'bytes32'];

/**
 * Creates a new asset and gives ownership to the specified account.
 * @param ledger Asset ledger instance.
 * @param receiverId Address that will receive the new asset.
 * @param id Asset id.
 * @param imprint Imprint (Merkle tree root) of the asset.
 */
export default async function(ledger: AssetLedger, receiverId: string, id: string, imprint: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [receiverId, id, imprint]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
