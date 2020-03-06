import { DappValueApproveOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { getOrderInputParams } from '../../lib/dapp-value-approve-order';

const functionSignature = '0x680f36e2';
const inputTypes = ['address', 'address', 'uint256', 'address', 'uint256', 'uint256', 'uint256'];
const outputTypes = ['bytes32'];

/**
 * Creates hash from deploy data.
 * @param gateway Gateway instance.
 * @param order AssetSetOperatorOrder data.
 */

export default async function(gateway: Gateway, order: DappValueApproveOrder) {
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
