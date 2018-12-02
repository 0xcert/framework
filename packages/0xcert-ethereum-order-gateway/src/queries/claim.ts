import { Order } from '@0xcert/scaffold';
import { OrderGateway } from '../core/gateway';
import { createOrderHash } from '../lib/order';

/**
 * Creates order hash, signes it and returns signed order claim.
 */
export default async function(gateway: OrderGateway, order: Order) {
  const message = createOrderHash(gateway.id, order);
  const res = await gateway.provider.post({
    method: 'eth_sign',
    params: [gateway.provider.accountId, message],
  });
  return `${gateway.provider.signMethod}:${res.result}`;
}
