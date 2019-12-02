import { GeneralAssetLedgerAbility, SuperAssetLedgerAbility } from '@0xcert/scaffold';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0xba00a330';
const inputTypes = ['address', 'uint256'];
const outputTypes = ['bool'];

/**
 * Gets an array of all abilities an account has.
 * @param ledger Asset ledger instance.
 * @param accountId Account id.
 */
export default async function(ledger: AssetLedger, accountId: string) {
  return Promise.all(
    [ SuperAssetLedgerAbility.MANAGE_ABILITIES,
      GeneralAssetLedgerAbility.CREATE_ASSET,
      GeneralAssetLedgerAbility.REVOKE_ASSET,
      GeneralAssetLedgerAbility.TOGGLE_TRANSFERS,
      GeneralAssetLedgerAbility.UPDATE_ASSET,
      GeneralAssetLedgerAbility.ALLOW_CREATE_ASSET,
      GeneralAssetLedgerAbility.UPDATE_URI_BASE,
      GeneralAssetLedgerAbility.ALLOW_UPDATE_ASSET_IMPRINT,
    ].map(async (ability) => {
      const attrs = {
        to: ledger.id,
        data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [accountId, ability]).substr(2),
      };
      const res = await ledger.provider.post({
        method: 'eth_call',
        params: [attrs, 'latest'],
      });
      return ledger.provider.encoder.decodeParameters(outputTypes, res.result)[0] ? ability : -1;
    }),
  ).then((abilities) => {
    return abilities.filter((a) => a !== -1).sort((a, b) => a - b);
  }).catch((error) => {
    ledger.provider.log(error);
    return [];
  });
}
