import { AssetLedger } from '../core/ledger';

const functionSignature = '0xb187bd26';
const inputTypes = [];
const outputTypes = ['bool'];

/**
 * Checks if the transfer is enabled.
 * @param ledger Asset ledger instance.
 */
export default async function(ledger: AssetLedger) {
  try {
    const attrs = {
      to: ledger.id,
      data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, []).substr(2),
    };
    const res = await ledger.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return !ledger.provider.encoder.decodeParameters(outputTypes, res.result)[0];
  } catch (error) {
    ledger.provider.log(error);
    return null;
  }
}
