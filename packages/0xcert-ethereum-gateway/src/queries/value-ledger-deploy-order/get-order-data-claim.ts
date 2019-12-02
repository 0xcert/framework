import { ValueLedgerDeployOrder } from '@0xcert/scaffold';
import { Gateway } from '../../core/gateway';
import { createRecipeTuple } from '../../lib/value-ledger-deploy-order';

const functionSignature = '0xc11e8b7a';
const inputTypes = ['tuple(address, address, tuple(string, string, uint256, uint8, address), tuple(address, address, uint256), uint256, uint256)'];
const outputTypes = ['bytes32'];

/**
 * Creates hash from deploy data.
 * @param gateway Gateway instance.
 * @param order ValueLedgerDeployOrder data.
 */

export default async function(gateway: Gateway, order: ValueLedgerDeployOrder) {
  const recipeTuple = createRecipeTuple(order);
  try {
    const attrs = {
      to: gateway.config.valueLedgerDeployOrderId,
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
