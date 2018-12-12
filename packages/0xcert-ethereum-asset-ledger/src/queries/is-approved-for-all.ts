import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'isApprovedForAll' && a.type === 'function'
));

/**
 * Checks if an account is approved for controling all assets of another account.
 * @param ledger Asset ledger instance.
 * @param accountId Account id.
 * @param operatorId Operator account id.
 */
export default async function(ledger: AssetLedger, accountId: string, operatorId: string) {
  const attrs = {
    to: ledger.id,
    data: encodeFunctionCall(abi, [accountId, operatorId]),
  };
  const res = await ledger.provider.post({
    method: 'eth_call',
    params: [attrs, 'latest'],
  });
  return decodeParameters(abi.outputs, res.result)[0]
}
