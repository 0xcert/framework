import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeParameters } from '@0xcert/ethereum-utils';
import { OrderGateway } from '../core/gateway';
import { Order } from '../../../0xcert-scaffold/dist';
import { createRecipeTuple } from '../lib/order';

const functionSignature = '0x36d63aca';
const inputTypes = ['tuple(address, address, tuple[](uint8, uint32, address, bytes32, address, uint256), uint256, uint256)'];

/**
 * Cancels already submited order on the network.
 * @param gateway Order gateway instance.
 * @param order Order data.
 */
export default async function(gateway: OrderGateway, order: Order) {
  const recipeTuple = createRecipeTuple(gateway, order);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.id,
    data: functionSignature + encodeParameters(inputTypes, [recipeTuple]).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result);
}
