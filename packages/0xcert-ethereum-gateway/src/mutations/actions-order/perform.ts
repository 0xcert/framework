import { Mutation } from '@0xcert/ethereum-generic-provider';
import { ActionsOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple, createSignatureTuple } from '../../lib/actions-order';

const inputTypes = ['tuple(address[], tuple[](uint32, address, bytes), uint256, uint256)', 'tuple[](bytes32, bytes32, uint8, uint8)'];
const functionSignature = '0xb438bae1';
/**
 * Submits the provided order to the network.
 * @param gateway Order gateway instance.
 * @param order Order data.
 * @param claim Claim data.
 */
export default async function(gateway: Gateway, order: ActionsOrder, claim: string[]) {
  const recipeTuple = createRecipeTuple(gateway, order);
  const signatureTuple = createSignatureTuple(claim);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.config.actionsOrderId,
    data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple, signatureTuple]).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result, gateway);
}
