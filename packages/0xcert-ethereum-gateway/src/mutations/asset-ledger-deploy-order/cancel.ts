import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerDeployOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple } from '../../lib/asset-ledger-deploy-order';

const functionSignature = '0x9ebbc600';
const inputTypes = ['tuple(address, address, tuple(string, string, string, string, bytes32, bytes4[], address), tuple(address, address, uint256), uint256, uint256)'];

/**
 * Cancels already submited deploy on the network.
 * @param gateway Deploy gateway instance.
 * @param deploy Deploy data.
 */
export default async function(gateway: Gateway, order: AssetLedgerDeployOrder) {
  const recipeTuple = createRecipeTuple(order);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.config.assetLedgerDeployOrderId,
    data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple]).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result, gateway);
}
