import { decodeParameters, encodeParameters } from '@0xcert/ethereum-utils';
import { ValueLedger } from '../core/ledger';

const functionSignature = '0xdd62ed3e';
const inputTypes = ['address', 'address'];
const outputTypes = ['uint256'];

/**
 * Gets the amount of tokens an account approved for usage to another account.
 * @param ledger Value ledger instance.
 * @param accountId Token owner account id.
 * @param spenderId Approved spender account id.
 */
export default async function(ledger: ValueLedger, accountId: string, spenderId: string) {
  try {
    const attrs = {
      to: ledger.id,
      data: functionSignature + encodeParameters(inputTypes, [accountId, spenderId]).substr(2),
    };
    const res = await ledger.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return decodeParameters(outputTypes, res.result)[0].toString();
  } catch (error) {
    return null;
  }
}
