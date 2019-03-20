import { Order } from '@0xcert/scaffold';
import { OrderGateway } from '../core/gateway';
import { createOrderHash } from '../lib/order';

/**
 * Creates order hash, signes it and returns eth signed order claim.
 * @param gateway Order gateway instance.
 * @param order Order data.
 */
export default async function(gateway: OrderGateway, order: Order) {
  const message = createOrderHash(gateway, order);
  const res = await gateway.provider.post({
    method: 'eth_sign',
    params: [gateway.provider.accountId, message],
  });
  return `${gateway.provider.signMethod}:${res.result}`;
}
