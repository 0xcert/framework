import { Mutation } from '@0xcert/ethereum-generic-provider';
import { MultiOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple, createSignatureTuple } from '../../lib/multi-order';
import { zeroAddress } from '../../lib/utils';

const inputTypes = ['tuple(address, address, tuple[](uint8, uint32, address, bytes32, address, uint256), uint256, uint256)', 'tuple(bytes32, bytes32, uint8, uint8)'];

/**
 * Submits the provided order to the network.
 * @param gateway Order gateway instance.
 * @param order Order data.
 * @param claim Claim data.
 */
export default async function(gateway: Gateway, order: MultiOrder, claim: string) {
  const functionSignature = order.takerId === zeroAddress ? '0x04aa2cb7' : '0x8b1d8335'; // performAnyTaker or perform
  const recipeTuple = createRecipeTuple(gateway, order);
  const signatureTuple = createSignatureTuple(claim);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.config.multiOrderId,
    data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple, signatureTuple]).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result);
}
