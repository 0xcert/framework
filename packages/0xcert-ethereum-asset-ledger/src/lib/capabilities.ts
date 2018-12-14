import { AssetLedgerCapability } from "@0xcert/scaffold";

/**
 * Converts capability code into Xcert interface.
 * @param capability Capability code.
 */
export function getInterfaceCode(capability: AssetLedgerCapability) {
  switch (capability) {
    case AssetLedgerCapability.BURN:
      return '0x42966c68';
    case AssetLedgerCapability.REVOKE:
      return '0x20c5429b';
    case AssetLedgerCapability.TOGGLE_TRANSFER:
      return '0xbedb86fb';
    case AssetLedgerCapability.UPDATE_IMPRINT:
      return '0xbda0e852';
    default:
      return null;
  }
}
