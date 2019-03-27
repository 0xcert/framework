import * as ethereum from '@0xcert/ethereum-order-gateway';
import { normalizeAddress } from '@0xcert/wanchain-utils';
import { normalizeOrderIds } from '../lib/order';

/**
 * Wanchain order gateway implementation.
 */
export class OrderGateway extends ethereum.OrderGateway {

  /**
   * Normalizes the Ethereum address.
   * NOTE: This method is here to easily extend the class for related platforms
   * such as Wanchain.
   */
  protected normalizeAddress(address: string): string {
    return normalizeAddress(address);
  }

  /**
   * Normalizes the Ethereum addresses of an order.
   * NOTE: This method is here to easily extend the class for related platforms
   * such as Wanchain.
   */
  protected normalizeOrderIds(order: ethereum.Order): ethereum.Order {
    return normalizeOrderIds(order);
  }

}
