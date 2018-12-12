import { AssetLedgerAbility } from "@0xcert/scaffold";
import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'isAble' && a.type === 'function'
));

/**
 * Gets an array of all abilities an account has.
 * @param ledger Asset ledger instance.
 * @param accountId Account id.
 */
export default async function(ledger: AssetLedger, accountId: string) {
  return await Promise.all(
    [ AssetLedgerAbility.MANAGE_ABILITIES,
      AssetLedgerAbility.MINT_ASSET,
      AssetLedgerAbility.PAUSE_TRANSFER,
      AssetLedgerAbility.REVOKE_ASSET,
      AssetLedgerAbility.SIGN_MINT_CLAIM,
      AssetLedgerAbility.UPDATE_PROOF,
    ].map(async (ability) => {
      const attrs = {
        to: ledger.id,
        data: encodeFunctionCall(abi, [accountId, ability]),
      };
      const res = await ledger.provider.post({
        method: 'eth_call',
        params: [attrs, 'latest'],
      });
      return decodeParameters(abi.outputs, res.result)[0] ? ability : -1;
    })
  ).then((abilities) => {
    return abilities.filter((a) => a !== -1).sort();
  });
}
