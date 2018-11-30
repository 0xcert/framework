import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'transferFrom' && a.type === 'function'
));

/**
 * Transfers asset from one account to another.
 */
export default async function(ledger: AssetLedger, to: string, assetId: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: encodeFunctionCall(abi, [ledger.provider.accountId, to, assetId]),
    gas: 6000000,
  };
  const res = await ledger.provider.send({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
