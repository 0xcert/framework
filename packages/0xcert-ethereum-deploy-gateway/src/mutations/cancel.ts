import { Mutation } from '@0xcert/ethereum-generic-provider';
import { Deploy } from '../../../0xcert-scaffold/dist';
import { DeployGateway } from '../core/gateway';
import { createRecipeTuple } from '../lib/deploy';

const functionSignature = '0xa7a6fdb1';
const inputTypes = ['tuple(address, address, tuple(string, string, string, bytes32, bytes4[], address), tuple(address, address, uint256), uint256, uint256)'];

/**
 * Cancels already submited deploy on the network.
 * @param gateway Deploy gateway instance.
 * @param deploy Deploy data.
 */
export default async function(gateway: DeployGateway, deploy: Deploy) {
  const recipeTuple = createRecipeTuple(deploy);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.id,
    data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple]).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result);
}
