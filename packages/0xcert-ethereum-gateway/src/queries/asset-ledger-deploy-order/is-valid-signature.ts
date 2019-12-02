import { AssetLedgerDeployOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createOrderHash, createSignatureTuple } from '../../lib/asset-ledger-deploy-order';

const functionSignature = '0x8fa76d8d';
const inputTypes = ['address', 'bytes32', 'tuple(bytes32, bytes32, uint8, uint8)'];
const outputTypes = ['bool'];

/**
 * Checks if signature is valid.
 * @param gateway Dateway instance.
 * @param order AssetLedgerDeployOrder data.
 * @param claim Claim data.
 */
export default async function(gateway: Gateway, order: AssetLedgerDeployOrder, claim: string) {
  const orderHash = createOrderHash(gateway, order);
  const signatureTuple = createSignatureTuple(claim);
  try {
    const attrs = {
      to: gateway.config.assetLedgerDeployOrderId,
      data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [order.makerId, orderHash, signatureTuple]).substr(2),
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
