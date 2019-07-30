import { AssetLedgerDeployOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createOrderHash } from '../../lib/asset-ledger-deploy-order';

/**
 * Creates deploy hash, signs it and returns personal signed deploy claim.
 * @param gateway Gateway instance.
 * @param deploy Deploy data.
 */
export default async function(gateway: Gateway, order: AssetLedgerDeployOrder) {
  const message = createOrderHash(gateway, order);
  const res = await gateway.provider.post({
    method: 'personal_sign',
    params: [message, gateway.provider.accountId, null],
  });
  return `${gateway.provider.signMethod}:${res.result}`;
}
