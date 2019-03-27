import * as ethereum from '@0xcert/ethereum-value-ledger';
import { normalizeAddress } from '@0xcert/wanchain-utils';

/**
 * Wanchain value ledger implementation.
 */
export class ValueLedger extends ethereum.ValueLedger {

  /**
   * OVERRIDE: Normalizes the Wanchain address.
   */
  protected normalizeAddress(address: string): string {
    return normalizeAddress(address);
  }

}
