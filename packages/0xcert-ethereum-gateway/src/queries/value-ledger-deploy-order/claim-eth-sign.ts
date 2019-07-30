import { ValueLedgerDeployOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createOrderHash } from '../../lib/value-ledger-deploy-order';

/**
 * Creates deploy hash, signs it and returns eth signed deploy claim.
 * @param gateway Gateway instance.
 * @param deploy Deploy data.
 */
export default async function(gateway: Gateway, order: ValueLedgerDeployOrder) {
  const message = createOrderHash(gateway, order);
  const res = await gateway.provider.post({
    method: 'eth_sign',
    params: [gateway.provider.accountId, message],
  });
  return `${gateway.provider.signMethod}:${res.result}`;
}
