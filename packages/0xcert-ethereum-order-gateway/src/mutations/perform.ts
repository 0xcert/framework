import { Mutation } from '@0xcert/ethereum-generic-provider';
import { Order } from '../../../0xcert-scaffold/dist';
import { OrderGateway } from '../core/gateway';
import { createRecipeTuple, createSignatureTuple, zeroAddress } from '../lib/order';

const inputTypes = ['tuple(address, address, tuple[](uint8, uint32, address, bytes32, address, uint256), uint256, uint256)', 'tuple(bytes32, bytes32, uint8, uint8)'];

/**
 * Submits the provided order to the network.
 * @param gateway Order gateway instance.
 * @param order Order data.
 * @param claim Claim data.
 */
export default async function(gateway: OrderGateway, order: Order, claim: string) {
  let functionSignature = '0x8b1d8335'; // perform
  if (order.takerId === zeroAddress) {
    functionSignature = '0x04aa2cb7'; // performAnyTaker
  }
  const recipeTuple = createRecipeTuple(gateway, order);
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
