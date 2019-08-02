import { ActionsOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createOrderHash } from '../../lib/actions-order';

/**
 * Creates order hash, signs it and returns eth signed order claim.
 * @param gateway Order gateway instance.
 * @param order Order data.
 */
export default async function(gateway: Gateway, order: ActionsOrder) {
  const message = createOrderHash(gateway, order);
  const res = await gateway.provider.post({
    method: 'eth_sign',
    params: [gateway.provider.accountId, message],
  });
  return `${gateway.provider.signMethod}:${res.result}`;
}
