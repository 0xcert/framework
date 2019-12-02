import { Gateway } from '../../core/gateway';
import { ProxyId } from '../../core/types';

const functionSignature = '0xabd90f85';
const inputTypes = ['uint8'];
const outputTypes = ['address'];

/**
 * Returns proxy address based on id used by this gateway.
 * @param gateway Order gateway instance.
 * @param proxyId Proxy id.
 */
export default async function(gateway: Gateway, proxyId: ProxyId) {
  try {
    const attrs = {
      to: gateway.config.actionsOrderId,
      data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [proxyId]).substr(2),
    };
    const res = await gateway.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return gateway.provider.encoder.decodeParameters(outputTypes, res.result)[0];
  } catch (error) {
    gateway.provider.log(error);
    return null;
  }
}
