import { DeployGateway } from '../core/gateway';

const functionSignature = '0x0eefdbad';
const outputTypes = ['address'];

/**
 * Returns token proxy address.
 * @param gateway Deploy gateway instance.
 */
export default async function(gateway: DeployGateway) {
  try {
    const attrs = {
      to: gateway.id,
      data: functionSignature,
    };
    const res = await gateway.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return gateway.provider.encoder.decodeParameters(outputTypes, res.result)[0];
  } catch (error) {
    return null;
  }
}
