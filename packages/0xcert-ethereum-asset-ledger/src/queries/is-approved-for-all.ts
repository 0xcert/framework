import { AssetLedger } from '../core/ledger';

const functionSignature = '0xe985e9c5';
const inputTypes = ['address', 'address'];
const outputTypes = ['bool'];

/**
 * Checks if an account is approved for controling all assets of another account.
 * @param ledger Asset ledger instance.
 * @param accountId Account id.
 * @param operatorId Operator account id.
 */
export default async function(ledger: AssetLedger, accountId: string, operatorId: string) {
  try {
    const attrs = {
      to: ledger.id,
      data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [accountId, operatorId]).substr(2),
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
