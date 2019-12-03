import { ValueLedger } from '../core/ledger';

const functionSignature = '0x70a08231';
const inputTypes = ['address'];
const outputTypes = ['uint256'];

/**
 * Gets the amount of token an account owns.
 * @param ledger Value ledger instance.
 * @param accountId Account address.
 */
export default async function(ledger: ValueLedger, accountId: string) {
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
