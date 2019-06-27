import { Deploy } from '@0xcert/scaffold';
import { DeployGateway } from '../core/gateway';
import { createDeployHash, createSignatureTuple } from '../lib/deploy';

const functionSignature = '0x8fa76d8d';
const inputTypes = ['address', 'bytes32', 'tuple(bytes32, bytes32, uint8, uint8)'];
const outputTypes = ['bool'];

/**
 * Checks if signature is valid.
 * @param gateway Order gateway instance.
 * @param order Order data.
 * @param claim Claim data.
 */
export default async function(gateway: DeployGateway, deploy: Deploy, claim: string) {
  const orderHash = createDeployHash(gateway, deploy);
  const signatureTuple = createSignatureTuple(claim);
  try {
    const attrs = {
      to: gateway.id,
      data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [deploy.makerId, orderHash, signatureTuple]).substr(2),
    };
    const res = await gateway.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return gateway.provider.encoder.decodeParameters(outputTypes, res.result)[0];
  } catch (error) {
    return null;
  }
}
