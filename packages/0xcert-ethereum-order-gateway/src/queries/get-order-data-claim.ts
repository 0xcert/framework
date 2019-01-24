import { decodeParameters, encodeParameters } from '@0xcert/ethereum-utils';
import { Order } from '@0xcert/scaffold';
import { OrderGateway } from '../core/gateway';
import { createRecipeTuple } from '../lib/order';

const functionSignature = '0xd1c87f30';
const inputTypes = ['tuple(address, address, tuple[](uint8, uint32, address, bytes32, address, uint256), uint256, uint256)'];
const outputTypes = ['bytes32'];

/**
 * Creates hash from order data.
 * @param gateway Order gateway instance.
 * @param order Order data.
 */
export default async function(gateway: OrderGateway, order: Order) {
  const recipeTuple = createRecipeTuple(gateway, order);
  try {
    const attrs = {
      to: gateway.id,
      data: functionSignature + encodeParameters(inputTypes, [recipeTuple]).substr(2),
    };
    const res = await gateway.provider.post({
      method: 'eth_call',
      params: [attrs, 'latest'],
    });
    return decodeParameters(outputTypes, res.result)[0];
  } catch (error) {
    return null;
  }
}
