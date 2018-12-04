import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { OrderGateway } from '../core/gateway';
import { Order } from '../../../0xcert-scaffold/dist';
import { createRecipeTuple, createSignatureTuple } from '../lib/order';
import gatewayAbi from '../config/gateway-abi';

/**
 * Smart contract method abi.
 */
const abi = gatewayAbi.find((a) => (
  a.name === 'perform' && a.type === 'function'
));

/**
 * Submits the provided order to the network.
 */
export default async function(gateway: OrderGateway, order: Order, claim: string) {
  const recipeTuple = createRecipeTuple(gateway, order);
  const signatureTuple = createSignatureTuple(claim);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.id,
    data: encodeFunctionCall(abi, [recipeTuple, signatureTuple]),
    gas: 6000000,
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result);
}
