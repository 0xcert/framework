import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { OrderGateway } from '../core/gateway';
import gatewayAbi from '../config/gateway-abi';
import { Order } from '@0xcert/scaffold';
import { createSignatureTuple, createOrderHash } from '../lib/order';

/**
 * Smart contract method abi.
 */
const abi = gatewayAbi.find((a) => (
  a.name === 'isValidSignature' && a.type === 'function'
));

/**
 * Checks if signature is valid.
 * @param gateway Order gateway instance.
 * @param order Order data.
 * @param claim Claim data.
 */
export default async function(gateway: OrderGateway, order: Order, claim: string) {
  const orderHash = createOrderHash(gateway, order);
  const signatureTuple = createSignatureTuple(claim);

  try {
    const attrs = {
      to: gateway.id,
      data: encodeFunctionCall(abi, [order.makerId, orderHash, signatureTuple]),
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
