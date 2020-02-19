import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0x0d04c3b8';
const inputTypes = ['uint256', 'bytes32'];

/**
 * Updates asset imprint.
 * @param ledger Asset ledger instance.
 * @param assetId Asset id.
 * @param imprint New imprint.
 */
export default async function(ledger: AssetLedger, assetId: string, imprint: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [assetId, imprint]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
