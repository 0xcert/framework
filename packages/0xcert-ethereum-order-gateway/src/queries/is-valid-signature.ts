import { decodeParameters, encodeParameters } from '@0xcert/ethereum-utils';
import { OrderGateway } from '../core/gateway';
import { Order } from '@0xcert/scaffold';
import { createSignatureTuple, createOrderHash } from '../lib/order';

const functionSignature = '0x8fa76d8d';
const inputTypes = ['address', 'bytes32', 'tuple(bytes32, bytes32, uint8, uint8)'];
const outputTypes = ['bool'];

/**
 * Checks if signature is valid.
 * @param gateway Order gateway instance.
 * @param order Order data.
 * @param claim Claim data.
 */
export default async function(gateway: OrderGateway, order: Order, claim: string) {
  const orderHash = createOrderHash(gateway, order);
  const signatureTuple = createSignatureTuple(claim);
  try {
    const attrs = {
      to: gateway.id,
      data: functionSignature + encodeParameters(inputTypes, [order.makerId, orderHash, signatureTuple]).substr(2),
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
