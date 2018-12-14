import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { OrderGateway } from '../core/gateway';
import { OrderGatewayProxy } from '../core/types';
import gatewayAbi from '../config/gateway-abi';

/**
 * Smart contract method abi.
 */
const abi = gatewayAbi.find((a) => (
  a.name === 'idToProxy' && a.type === 'function'
));

/**
 * Returns proxy address based on id used by this gateway.
 * @param gateway Order gateway instance.
 * @param proxyId Proxy id.
 */
export default async function(gateway: OrderGateway, proxyId: OrderGatewayProxy) {
  try {
    const attrs = {
      to: gateway.id,
      data: encodeFunctionCall(abi, [proxyId]),
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
