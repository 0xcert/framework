import { Deploy } from '@0xcert/scaffold';
import { DeployGateway } from '../core/gateway';
import { createRecipeTuple } from '../lib/deploy';

const functionSignature = '0xf089295c';
const inputTypes = ['tuple(address, address, tuple(string, string, string, bytes32, bytes4[], address), tuple(address, address, uint256), uint256, uint256)'];
const outputTypes = ['bytes32'];

/**
 * Creates hash from deploy data.
 * @param gateway Deploy gateway instance.
 * @param Deploy Deploy data.
 */

export default async function(gateway: DeployGateway, deploy: Deploy) {
  const recipeTuple = createRecipeTuple(deploy);
  try {
    const attrs = {
      to: gateway.id,
      data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple]).substr(2),
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
