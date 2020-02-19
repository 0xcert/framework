import { AssetLedgerCapability } from '@0xcert/scaffold';

/**
 * Converts capability code into Xcert interface.
 * @param capability Capability code.
 */
export function getInterfaceCode(capability: AssetLedgerCapability): string {
    if (capability == AssetLedgerCapability.DESTROY_ASSET) {
        return '0x9d118770';
    } else if (capability == AssetLedgerCapability.REVOKE_ASSET) {
        return '0x20c5429b';
    } else if (capability == AssetLedgerCapability.UPDATE_ASSET) {
      return '0x0d04c3b8';
    }  else if (capability == AssetLedgerCapability.TOGGLE_TRANSFERS) {
        return '0xbedb86fb';
    } else {
        return null;
    }
}
