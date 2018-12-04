import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { OrderGateway } from '../core/gateway';
import { Order } from '../../../0xcert-scaffold/dist';
import { createRecipeTuple } from '../lib/order';
import gatewayAbi from '../config/gatewayAbi';

/**
 * Smart contract method abi.
 */
const abi = gatewayAbi.find((a) => (
  a.name === 'cancel' && a.type === 'function'
));

/**
 * Cancels already submited order on the network.
 */
export default async function(gateway: OrderGateway, order: Order) {
  const recipeTuple = createRecipeTuple(gateway, order);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.id,
    data: encodeFunctionCall(abi, [recipeTuple]),
    gas: 6000000,
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result);
}
