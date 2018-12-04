import { encodeFunctionCall, decodeParameters } from '@0xcert/ethereum-utils';
import { ValueLedger } from '../core/ledger';
import { OrderGatewayBase } from '@0xcert/scaffold';
import approveAccount from './approve-account';
import orderGatewayAbi from '../config/order-gateway-abi';

/**
 * Smart contract method abi.
 */
const abi = orderGatewayAbi.find((a) => (
  a.name === 'idToProxy' && a.type === 'function'
));

/**
 * 
 */
async function getProxyAddress(ledger: ValueLedger, orderGateway: OrderGatewayBase) {
  const attrs = {
    to: orderGateway.id,
    data: encodeFunctionCall(abi, [1]),
  };
  const res = await ledger.provider.post({
    method: 'eth_call',
    params: [attrs, 'latest'],
  });
  return decodeParameters(abi.outputs, res.result)[0];
}

/**
 * Approves order ledger's proxy for transfering a specific token.
 */
export default async function(ledger: ValueLedger, orderGateway: OrderGatewayBase, assetId: string) {
  const accountId = await getProxyAddress(ledger, orderGateway);
  return approveAccount(ledger, accountId, assetId);
}
