import { Mutation } from '@0xcert/ethereum-generic-provider';
import { ValueLedgerDeployOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple } from '../../lib/value-ledger-deploy-order';

const functionSignature = '0x4e4631e7';
const inputTypes = ['tuple(address, address, tuple(string, string, uint256, uint8, address), tuple(address, address, uint256), uint256, uint256)'];

/**
 * Cancels already submited deploy on the network.
 * @param gateway Deploy gateway instance.
 * @param deploy Deploy data.
 */
export default async function(gateway: Gateway, order: ValueLedgerDeployOrder) {
  const recipeTuple = createRecipeTuple(order);
  const attrs = {
    from: gateway.provider.accountId,
    to: gateway.config.valueLedgerDeployOrderId,
    data: functionSignature + gateway.provider.encoder.encodeParameters(inputTypes, [recipeTuple]).substr(2),
  };
  const res = await gateway.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(gateway.provider, res.result, gateway);
}
