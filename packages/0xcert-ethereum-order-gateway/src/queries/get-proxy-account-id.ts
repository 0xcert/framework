import { decodeParameters, encodeParameters } from '@0xcert/ethereum-utils';
import { OrderGateway } from '../core/gateway';
import { OrderGatewayProxy } from '../core/types';

const functionSignature = '0xabd90f85';
const inputTypes = ['uint8'];
const outputTypes = ['address'];

/**
 * Returns proxy address based on id used by this gateway.
 * @param gateway Order gateway instance.
 * @param proxyId Proxy id.
 */
export default async function(gateway: OrderGateway, proxyId: OrderGatewayProxy) {
  try {
    const attrs = {
      to: gateway.id,
      data: functionSignature + encodeParameters(inputTypes, [proxyId]).substr(2),
    };
    const res = await gateway.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return decodeParameters(outputTypes, res.result)[0];
  } catch (error) {
    return null;
  }
}
