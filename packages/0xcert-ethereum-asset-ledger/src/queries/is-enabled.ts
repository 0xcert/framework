import { decodeParameters, encodeParameters } from '@0xcert/ethereum-utils';
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
      data: functionSignature + encodeParameters(inputTypes, []).substr(2),
    };
    const res = await ledger.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return !decodeParameters(outputTypes, res.result)[0];
  } catch (error) {
    return null;
  }
}
