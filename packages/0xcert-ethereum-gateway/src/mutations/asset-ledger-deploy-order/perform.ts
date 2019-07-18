import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerDeployOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple, createSignatureTuple } from '../../lib/asset-ledger-deploy-order';
import { zeroAddress } from '../../lib/utils';

const inputTypes = ['tuple(address, address, tuple(string, string, string, bytes32, bytes4[], address), tuple(address, address, uint256), uint256, uint256)', 'tuple(bytes32, bytes32, uint8, uint8)'];

/**
 * Submits the provided deploy to the network.
 * @param gateway Deploy gateway instance.
 * @param deploy Deploy data.
 * @param claim Claim data.
 */
export default async function(gateway: Gateway, order: AssetLedgerDeployOrder, claim: string) {
  const functionSignature = order.takerId === zeroAddress ? '0x14d3e0ec' : '0x8da73a16'; // performAnyTaker or perform
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
  return new Mutation(gateway.provider, res.result);
}
