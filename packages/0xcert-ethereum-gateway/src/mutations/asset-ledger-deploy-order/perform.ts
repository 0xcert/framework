import { Mutation } from '@0xcert/ethereum-generic-provider';
import { ZERO_ADDRESS } from '@0xcert/ethereum-utils';
import { AssetLedgerDeployOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple, createSignatureTuple } from '../../lib/asset-ledger-deploy-order';

const inputTypes = ['tuple(address, address, tuple(string, string, string, string, bytes32, bytes4[], address), tuple(address, address, uint256), uint256, uint256)', 'tuple(bytes32, bytes32, uint8, uint8)'];

/**
 * Submits the provided deploy to the network.
 * @param gateway Deploy gateway instance.
 * @param deploy Deploy data.
 * @param claim Claim data.
 */
export default async function(gateway: Gateway, order: AssetLedgerDeployOrder, claim: string) {
  const functionSignature = order.takerId === ZERO_ADDRESS ? '0xef48e40c' : '0xb2a9e276'; // performAnyTaker or perform
  const recipeTuple = createRecipeTuple(order);
  const signatureTuple = createSignatureTuple(claim);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.config.assetLedgerDeployOrderId,
    data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple, signatureTuple]).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result, gateway);
}
