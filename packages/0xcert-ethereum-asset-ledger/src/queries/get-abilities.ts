import { AssetLedgerAbility } from "@0xcert/scaffold";
import { decodeParameters, encodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0x65521111';
const inputTypes = ['address', 'uint8'];
const outputTypes = ['bool'];

/**
 * Gets an array of all abilities an account has.
 * @param ledger Asset ledger instance.
 * @param accountId Account id.
 */
export default async function(ledger: AssetLedger, accountId: string) {
  return await Promise.all(
    [ AssetLedgerAbility.MANAGE_ABILITIES,
      AssetLedgerAbility.CREATE_ASSET,
      AssetLedgerAbility.REVOKE_ASSET,
      AssetLedgerAbility.TOGGLE_TRANSFERS,
      AssetLedgerAbility.UPDATE_ASSET,
      AssetLedgerAbility.UPDATE_URI_BASE,
    ].map(async (ability) => {
      const attrs = {
        to: ledger.id,
        data: functionSignature + encodeParameters(inputTypes, [accountId, ability]).substr(2),
      };
      const res = await ledger.provider.post({
        method: 'eth_call',
        params: [attrs, 'latest'],
      });
      return decodeParameters(outputTypes, res.result)[0] ? ability : -1;
    })
  ).then((abilities) => {
    return abilities.filter((a) => a !== -1).sort();
  }).catch(() => {
    return [];
  });
}
