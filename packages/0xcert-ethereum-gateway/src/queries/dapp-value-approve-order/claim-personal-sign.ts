import { DappValueApproveOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createOrderHash } from '../../lib/dapp-value-approve-order';

/**
 * Creates set operator hash, signs it and returns personal signed set operator claim.
 * @param gateway Gateway instance.
 * @param order Set operator data.
 */
export default async function(gateway: Gateway, order: DappValueApproveOrder) {
  const message = createOrderHash(order);
  const res = await gateway.provider.post({
    method: 'personal_sign',
    params: [message, gateway.provider.accountId, null],
  });
  return `${gateway.provider.signMethod}:${res.result}`;
}
