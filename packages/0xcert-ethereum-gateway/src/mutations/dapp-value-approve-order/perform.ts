import { Mutation } from '@0xcert/ethereum-generic-provider';
import { DappValueApproveOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createSignatureTuple, getOrderInputParams } from '../../lib/dapp-value-approve-order';

const functionSignature = '0x5d19eb86';
const inputTypes = ['address', 'address', 'uint256', 'address', 'uint256', 'uint256', 'uint256', 'tuple(bytes32, bytes32, uint8, uint8)'];

/**
 * Submits the provided deploy to the network.
 * @param gateway Gateway instance.
 * @param order Order data.
 * @param claim Claim data.
 */
export default async function(gateway: Gateway, order: DappValueApproveOrder, claim: string) {
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
