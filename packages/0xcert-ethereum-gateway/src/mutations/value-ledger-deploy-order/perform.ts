import { Mutation } from '@0xcert/ethereum-generic-provider';
import { ZERO_ADDRESS } from '@0xcert/ethereum-utils';
import { ValueLedgerDeployOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple, createSignatureTuple } from '../../lib/value-ledger-deploy-order';

const inputTypes = ['tuple(address, address, tuple(string, string, uint256, uint8, address), tuple(address, address, uint256), uint256, uint256)', 'tuple(bytes32, bytes32, uint8, uint8)'];

/**
 * Submits the provided deploy to the network.
 * @param gateway Deploy gateway instance.
 * @param deploy Deploy data.
 * @param claim Claim data.
 */
export default async function(gateway: Gateway, order: ValueLedgerDeployOrder, claim: string) {
  const functionSignature = order.takerId === ZERO_ADDRESS ? '0x38d7d25c' : '0x15f0a1a6'; // performAnyTaker or perform
  const recipeTuple = createRecipeTuple(order);
  const signatureTuple = createSignatureTuple(claim);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.config.valueLedgerDeployOrderId,
    data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple, signatureTuple]).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result, gateway);
}
