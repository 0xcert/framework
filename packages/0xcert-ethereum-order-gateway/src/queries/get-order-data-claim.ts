import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { OrderGateway } from '../core/gateway';
import gatewayAbi from '../config/gateway-abi';
import { Order } from '@0xcert/scaffold';
import { createRecipeTuple } from '../lib/order';

/**
 * Smart contract method abi.
 */
const abi = gatewayAbi.find((a) => (
  a.name === 'getOrderDataClaim' && a.type === 'function'
));

/**
 * Creates hash from order data.
 * @param gateway Order gateway instance.
 * @param order Order data.
 */
export default async function(gateway: OrderGateway, order: Order) {
  const orderHash = createRecipeTuple(gateway, order);

  try {
    const attrs = {
      to: gateway.id,
      data: encodeFunctionCall(abi, [orderHash]),
    };
    const res = await gateway.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return decodeParameters(abi.outputs, res.result)[0];
  } catch (error) {
    return null;
  }
}
