import { Deploy } from '@0xcert/scaffold';
import { DeployGateway } from '../core/gateway';
import { createDeployHash } from '../lib/deploy';

/**
 * Creates deploy hash, signes it and returns eth signed deploy claim.
 * @param gateway Deploy gateway instance.
 * @param deploy Deploy data.
 */
export default async function(gateway: DeployGateway, deploy: Deploy) {
  const message = createDeployHash(gateway, deploy);
  const res = await gateway.provider.post({
    method: 'eth_sign',
    params: [gateway.provider.accountId, message],
  });
  return `${gateway.provider.signMethod}:${res.result}`;
}
