import { AssetLedgerCapability } from "@0xcert/scaffold";
import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import { getInterfaceCode } from '../lib/capabilities';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'supportsInterface' && a.type === 'function'
));

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
        data: encodeFunctionCall(abi, [code]),
      };
      const res = await ledger.provider.post({
        method: 'eth_call',
        params: [attrs, 'latest'],
      });
      return decodeParameters(abi.outputs, res.result)[0] ? capability : -1;
    })
  ).then((abilities) => {
    return abilities.filter((a) => a !== -1).sort() as AssetLedgerCapability[];
  }).catch(() => {
    return [];
  }); 
}
