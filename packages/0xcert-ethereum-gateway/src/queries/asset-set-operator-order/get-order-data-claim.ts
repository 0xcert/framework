import { AssetSetOperatorOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { getOrderInputParams } from '../../lib/asset-set-operator-order';

const functionSignature = '0xa0fd4195';
const inputTypes = ['address', 'address', 'bool', 'address', 'uint256', 'address', 'uint256', 'uint256'];
const outputTypes = ['bytes32'];

/**
 * Creates hash from deploy data.
 * @param gateway Gateway instance.
 * @param order AssetSetOperatorOrder data.
 */

export default async function(gateway: Gateway, order: AssetSetOperatorOrder) {
  const params = getOrderInputParams(order);
  try {
    const attrs = {
      to: order.ledgerId,
      data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, params).substr(2),
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
