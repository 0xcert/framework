import { AssetLedgerCapability } from "@0xcert/scaffold";
import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
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
    [ [AssetLedgerCapability.BURN, '0x42966c68'],
      [AssetLedgerCapability.UPDATE_IMPRINT, '0xbda0e852'],
      [AssetLedgerCapability.TOGGLE_TRANSFER, '0xbedb86fb'],
      [AssetLedgerCapability.REVOKE, '0x20c5429b'],
    ].map(async (capability) => {
      const attrs = {
        to: ledger.id,
        data: encodeFunctionCall(abi, [capability[1]]),
      };
      const res = await ledger.provider.post({
        method: 'eth_call',
        params: [attrs, 'latest'],
      });
      return decodeParameters(abi.outputs, res.result)[0] ? capability[0] : -1;
    })
  ).then((abilities) => {
    return abilities.filter((a) => a !== -1).sort() as AssetLedgerCapability[];
  }).catch(() => {
    return [];
  }); 
}
