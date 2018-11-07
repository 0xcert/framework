import { AssetLedgerCapability } from "@0xcert/scaffold";
import { AssetLedger } from "../core/ledger";

/**
 * 
 */
export default async function(ledger: AssetLedger) {
  return ledger.context.query<AssetLedgerCapability[]>(async () => {
    return await Promise.all(
      [ [AssetLedgerCapability.BURNABLE, '0x42966c68'],
        [AssetLedgerCapability.MUTABLE, '0x5e2161af'],
        [AssetLedgerCapability.PAUSABLE, '0xbedb86fb'],
        [AssetLedgerCapability.REVOKABLE, '0x20c5429b'],
      ].map(async (capability) => {
        const supported = await ledger.contract.methods.supportsInterface(capability[1]).call();
        return supported ? capability[0] : -1;
      })
    ).then((abilities) => {
      return abilities.filter((a) => a !== -1).sort() as AssetLedgerCapability[];
    });
  })
}
