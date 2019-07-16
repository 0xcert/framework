import { Mutation } from '@0xcert/ethereum-generic-provider';
import { MultiOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple } from '../../lib/multi-order';

const functionSignature = '0x36d63aca';
const inputTypes = ['tuple(address, address, tuple[](uint8, uint32, address, bytes32, address, uint256), uint256, uint256)'];

/**
 * Cancels already submited order on the network.
 * @param gateway Order gateway instance.
 * @param order Order data.
 */
export default async function(gateway: Gateway, order: MultiOrder) {
  const recipeTuple = createRecipeTuple(gateway, order);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.id,
    data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple]).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result);
}
