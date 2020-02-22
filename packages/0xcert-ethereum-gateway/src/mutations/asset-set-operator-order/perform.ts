import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetSetOperatorOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createSignatureTuple, getOrderInputParams } from '../../lib/asset-set-operator-order';

const functionSignature = '0x7f9b45b0';
const inputTypes = ['address', 'address', 'bool', 'address', 'uint256', 'address', 'uint256', 'uint256', 'tuple(bytes32, bytes32, uint8, uint8)'];

/**
 * Submits the provided deploy to the network.
 * @param gateway Deploy gateway instance.
 * @param order Asset set operator data.
 * @param claim Claim data.
 */
export default async function(gateway: Gateway, order: AssetSetOperatorOrder, claim: string) {
  const signatureTuple = createSignatureTuple(claim);
  const params = getOrderInputParams(order);
  params.push(signatureTuple);
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
