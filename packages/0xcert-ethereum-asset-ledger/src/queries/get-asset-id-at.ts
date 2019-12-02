import { AssetLedger } from '../core/ledger';

const functionSignature = '0x4f6ccce7';
const inputTypes = ['uint256'];
const outputTypes = ['uint256'];

/**
 * Get the ID of the asset at specified index
 * @param ledger Asset ledger instance.
 * @param index Asset index.
 */
export default async function(ledger: AssetLedger, index: number) {
  try {
    const attrs = {
      to: ledger.id,
      data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [index]).substr(2),
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
