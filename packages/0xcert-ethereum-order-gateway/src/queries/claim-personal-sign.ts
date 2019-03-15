import { Order } from '@0xcert/scaffold';
import { OrderGateway } from '../core/gateway';
import { createOrderHash } from '../lib/order';

/**
 * Creates order hash, signes it and returns personal signed order claim.
 * @param gateway Order gateway instance.
 * @param order Order data.
 */
export default async function(gateway: OrderGateway, order: Order) {
  const message = createOrderHash(gateway, order);
  const res = await gateway.provider.post({
    method: 'personal_sign',
    params: [message, gateway.provider.accountId, null],
  });
  return `${gateway.provider.signMethod}:${res.result}`;
}
