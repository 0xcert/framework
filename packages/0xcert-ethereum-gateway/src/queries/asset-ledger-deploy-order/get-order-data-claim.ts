import { AssetLedgerDeployOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple } from '../../lib/asset-ledger-deploy-order';

const functionSignature = '0x30d6f0fa';
const inputTypes = ['tuple(address, address, tuple(string, string, string, string, bytes32, bytes4[], address), tuple(address, address, uint256), uint256, uint256)'];
const outputTypes = ['bytes32'];

/**
 * Creates hash from deploy data.
 * @param gateway Gateway instance.
 * @param order AssetLedgerDeployOrder data.
 */

export default async function(gateway: Gateway, order: AssetLedgerDeployOrder) {
  const recipeTuple = createRecipeTuple(order);
  try {
    const attrs = {
      to: gateway.config.assetLedgerDeployOrderId,
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
