import { AssetLedgerCapability } from "@0xcert/scaffold";

/**
 * Converts capability code into Xcert interface.
 * @param capability Capability code.
 */
export function getInterfaceCode(capability: AssetLedgerCapability) {
  switch (capability) {
    case AssetLedgerCapability.BURN_ASSET:
      return '0x42966c68';
    case AssetLedgerCapability.REVOKE_ASSET:
      return '0x20c5429b';
    case AssetLedgerCapability.UPDATE_ASSET:
      return '0xbda0e852';
    case AssetLedgerCapability.TOGGLE_TRANSFERS:
      return '0xbedb86fb';
    default:
      return null;
  }
}
