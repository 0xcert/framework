import { AssetLedger } from '../core/ledger';

const functionSignature = '0x6352211e';
const inputTypes = ['uint256'];
const outputTypes = ['address'];

/**
 * Gets the account that owns the specific asset.
 * @param ledger Asset ledger instance.
 * @param assetId Asset id.
 */
export default async function(ledger: AssetLedger, assetId: string) {
  try {
    const attrs = {
      to: ledger.id,
      data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [assetId]).substr(2),
    };
    const res = await ledger.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return ledger.provider.encoder.decodeParameters(outputTypes, res.result)[0];
  } catch (error) {
    ledger.provider.log(error);
    return null;
  }
}
