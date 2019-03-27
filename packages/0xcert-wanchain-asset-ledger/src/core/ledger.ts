import * as ethereum from '@0xcert/ethereum-asset-ledger';
import { normalizeAddress } from '@0xcert/wanchain-utils';

/**
 * Wanchain asset ledger implementation.
 */
export class AssetLedger extends ethereum.AssetLedger {

  /**
   * OVERRIDE: Normalizes the Wanchain address.
   */
  protected normalizeAddress(address: string): string {
    return normalizeAddress(address);
  }

}
