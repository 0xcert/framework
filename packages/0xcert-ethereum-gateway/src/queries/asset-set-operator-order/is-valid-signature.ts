import { AssetSetOperatorOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createOrderHash, createSignatureTuple } from '../../lib/asset-set-operator-order';
const functionSignature = '0x8fa76d8d';
const inputTypes = ['address', 'bytes32', 'tuple(bytes32, bytes32, uint8, uint8)'];
const outputTypes = ['bool'];

/**
 * Checks if signature is valid.
 * @param gateway Gateway instance.
 * @param order AssetSetOperatorOrder data.
 * @param claim Claim data.
 */
export default async function(gateway: Gateway, order: AssetSetOperatorOrder, claim: string) {
  const signatureTuple = createSignatureTuple(claim);
  const orderHash = createOrderHash(order);
  try {
    const attrs = {
      to: order.ledgerId,
      data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [order.owner, orderHash, signatureTuple]).substr(2),
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
