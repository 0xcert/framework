import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'setApprovalForAll' && a.type === 'function'
));

/**
 * Sets aproval for an account to have control over all assets.
 * @param ledger Asset ledger instance.
 * @param accountId Account id.
 * @param approved Is approved or not.
 */
export default async function(ledger: AssetLedger, accountId: string, approved: boolean) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: encodeFunctionCall(abi, [accountId, approved]),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
