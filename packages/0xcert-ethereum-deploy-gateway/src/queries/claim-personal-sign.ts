import { Deploy } from '@0xcert/scaffold';
import { DeployGateway } from '../core/gateway';
import { createDeployHash } from '../lib/deploy';

/**
 * Creates deploy hash, signes it and returns personal signed deploy claim.
 * @param gateway Deploy gateway instance.
 * @param deploy Deploy data.
 */
export default async function(gateway: DeployGateway, deploy: Deploy) {
  const message = createDeployHash(gateway, deploy);
  const res = await gateway.provider.post({
    method: 'personal_sign',
    params: [message, gateway.provider.accountId, null],
  });
  return `${gateway.provider.signMethod}:${res.result}`;
}
