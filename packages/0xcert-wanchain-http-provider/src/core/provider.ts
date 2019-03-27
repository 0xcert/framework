import * as ethereum from '@0xcert/ethereum-http-provider';
import { normalizeAddress } from '@0xcert/wanchain-utils';

/**
 * HTTP RPC client.
 */
export class HttpProvider extends ethereum.HttpProvider {

  /**
   * OVERRIDE: Normalizes the Wanchain address.
   */
  protected normalizeAddress(address: string): string {
    return normalizeAddress(address);
  }

}
