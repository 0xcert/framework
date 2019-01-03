import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';

const inputTypes = ['address', 'address', 'uint256'];

/**
 * Transfers asset from one account to another while checking if receiving account can actually 
 * receive the asset (it fails if receiver is a smart contract that does not implement 
 * erc721receiver).
 * @param ledger Asset ledger instance.
 * @param receiverId Address that will receive the asset.
 * @param id Asset id.
 * @param receiverData Addition data that will be send to the receiver.
 */
export default async function(ledger: AssetLedger, receiverId: string, id: string, receiverData?: string) {
  const functionSignature = typeof receiverData !== 'undefined' ? '0xb88d4fde' : '0x42842e0e';
  if(typeof receiverData !== 'undefined') {
    inputTypes.push('bytes');
  }
  const data = [ledger.provider.accountId, receiverId, id, receiverData]
    .filter((a) => typeof a !== 'undefined');
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + encodeParameters(inputTypes, data).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  })
  return new Mutation(ledger.provider, res.result);
}
