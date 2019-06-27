import { Mutation } from '@0xcert/ethereum-generic-provider';
import { Deploy } from '../../../0xcert-scaffold/dist';
import { DeployGateway } from '../core/gateway';
import { createRecipeTuple, createSignatureTuple, zeroAddress } from '../lib/deploy';

const inputTypes = ['tuple(address, address, tuple(string, string, string, bytes32, bytes4[], address), tuple(address, address, uint256), uint256, uint256)', 'tuple(bytes32, bytes32, uint8, uint8)'];

/**
 * Submits the provided deploy to the network.
 * @param gateway Deploy gateway instance.
 * @param deploy Deploy data.
 * @param claim Claim data.
 */
export default async function(gateway: DeployGateway, deploy: Deploy, claim: string) {
  let functionSignature = '0x8da73a16'; // perform
  if (deploy.takerId === zeroAddress) {
    functionSignature = '0x14d3e0ec'; // performAnyTaker
  }
  const recipeTuple = createRecipeTuple(deploy);
  const signatureTuple = createSignatureTuple(claim);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.id,
    data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple, signatureTuple]).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result);
}
