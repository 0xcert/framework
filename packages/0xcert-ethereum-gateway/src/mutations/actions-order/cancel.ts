import { Mutation } from '@0xcert/ethereum-generic-provider';
import { ActionsOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple } from '../../lib/actions-order';

const functionSignature = '0x38a9bfcd';
const inputTypes = ['tuple(address[], tuple[](uint32, address, bytes), uint256, uint256)'];

/**
 * Cancels already submited order on the network.
 * @param gateway Order gateway instance.
 * @param order Order data.
 */
export default async function(gateway: Gateway, order: ActionsOrder) {
  const recipeTuple = createRecipeTuple(gateway, order);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.config.actionsOrderId,
    data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple]).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result, gateway);
}
