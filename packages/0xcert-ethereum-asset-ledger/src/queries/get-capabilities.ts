import { AssetLedgerCapability } from '@0xcert/scaffold';
import { AssetLedger } from '../core/ledger';
import { getInterfaceCode } from '../lib/capabilities';

const functionSignature = '0x01ffc9a7';
const inputTypes = ['bytes4'];
const outputTypes = ['bool'];

/**
 * Gets a list of all the asset ledger capabilities.
 * @param ledger Asset ledger instance.
 */
export default async function(ledger: AssetLedger) {
  return Promise.all(
    [ AssetLedgerCapability.DESTROY_ASSET,
      AssetLedgerCapability.REVOKE_ASSET,
      AssetLedgerCapability.TOGGLE_TRANSFERS,
      AssetLedgerCapability.UPDATE_ASSET,
    ].map(async (capability) => {
      const code = getInterfaceCode(capability);
      const attrs = {
        to: ledger.id,
        data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [code]).substr(2),
      };
      const res = await ledger.provider.post({
        method: 'eth_call',
        params: [attrs, 'latest'],
      });
      return ledger.provider.encoder.decodeParameters(outputTypes, res.result)[0] ? capability : -1;
    }),
  ).then((abilities) => {
    return abilities.filter((a) => a !== -1).sort() as AssetLedgerCapability[];
  }).catch((error) => {
    ledger.provider.log(error);
    return [];
  });
}
