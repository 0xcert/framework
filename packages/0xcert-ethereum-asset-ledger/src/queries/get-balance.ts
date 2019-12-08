import { AssetLedger } from '../core/ledger';

const functionSignature = '0x70a08231';
const inputTypes = ['address'];
const outputTypes = ['uint256'];

/**
 * Gets the amount of assets the account owns.
 * @param ledger Asset ledger instance.
 * @param accountId Account id.
 */
export default async function(ledger: AssetLedger, accountId: string) {
  try {
    const attrs = {
      to: ledger.id,
      data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [accountId]).substr(2),
    };
    const res = await ledger.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return ledger.provider.encoder.decodeParameters(outputTypes, res.result)[0].toString();
  } catch (error) {
    ledger.provider.log(error);
    return null;
  }
}
