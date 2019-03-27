import { Order } from '@0xcert/ethereum-order-gateway';
import { normalizeAddress } from '@0xcert/wanchain-utils';

/**
 * Normalizes order IDs and returns a new order object.
 * @param order Order instance.
 */
export function normalizeOrderIds(order: Order): Order {
  order = JSON.parse(JSON.stringify(order));
  order.makerId = normalizeAddress(order.makerId);
  order.takerId = normalizeAddress(order.takerId);
  order.actions.forEach((action) => {
    action.ledgerId = normalizeAddress(action.ledgerId);
    action.receiverId = normalizeAddress(action.receiverId);
    action.senderId = normalizeAddress(action.senderId);
  });
  return order;
}
