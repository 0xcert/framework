import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract method abi.
 */
const abis = xcertAbi.filter((a) => (
  a.name === 'safeTransferFrom' && a.type === 'function'
));

/**
 * Transfers asset from one account to another while checking if receiving account can actually 
 * receive the asset (it fails if receiver is a smart contract that does not implement 
 * erc721receiver).
 */
export default async function(ledger: AssetLedger, receiverId: string, id: string, receiverData?: string) {
  const abi = abis.find((a) => (
    a.inputs.length === (typeof receiverData !== 'undefined' ? 4 : 3)
  ));
  const data = [ledger.provider.accountId, receiverId, id, receiverData]
    .filter((a) => typeof a !== 'undefined');
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: encodeFunctionCall(abi, data),
    gas: 6000000,
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  })
  return new Mutation(ledger.provider, res.result);
}
