import { MultiOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createOrderHash } from '../../lib/multi-order';

/**
 * Creates order hash, signs it and returns personal signed order claim.
 * @param gateway Order gateway instance.
 * @param order Order data.
 */
export default async function(gateway: Gateway, order: MultiOrder) {
  const message = createOrderHash(gateway, order);
  const res = await gateway.provider.post({
    method: 'personal_sign',
    params: [message, gateway.provider.accountId, null],
  });
  return `${gateway.provider.signMethod}:${res.result}`;
}
