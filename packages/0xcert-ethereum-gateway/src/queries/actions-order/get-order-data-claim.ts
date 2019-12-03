import { ActionsOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple } from '../../lib/actions-order';

const functionSignature = '0x5f2aa503';
const inputTypes = ['tuple(address[], tuple[](uint32, address, bytes), uint256, uint256)'];
const outputTypes = ['bytes32'];

/**
 * Creates hash from order data.
 * @param gateway Order gateway instance.
 * @param order Order data.
 */
export default async function(gateway: Gateway, order: ActionsOrder) {
  const recipeTuple = createRecipeTuple(gateway, order);
  try {
    const attrs = {
      to: gateway.config.actionsOrderId,
      data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple]).substr(2),
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
