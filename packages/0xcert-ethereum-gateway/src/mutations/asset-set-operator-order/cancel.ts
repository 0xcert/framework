import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetSetOperatorOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { getOrderInputParams } from '../../lib/asset-set-operator-order';

const functionSignature = '0xce4e3273';
const inputTypes = ['address', 'address', 'bool', 'address', 'uint256', 'address', 'uint256', 'uint256'];

/**
 * Submits the provided deploy to the network.
 * @param gateway Deploy gateway instance.
 * @param order Asset set operator data.
 * @param claim Claim data.
 */
export default async function(gateway: Gateway, order: AssetSetOperatorOrder) {
  const params = getOrderInputParams(order);
  const attrs = {
    from: gateway.provider.accountId,
    to: order.ledgerId,
    data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, params).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result, gateway);
}
