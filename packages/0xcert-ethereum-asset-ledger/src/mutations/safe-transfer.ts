import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';

/**
 * Transfers asset from one account to another while checking if receiving
 * account can actually receive the asset (it fails if receiver is a smart
 * contract that does not implement erc721receiver).
 * @param ledger Asset ledger instance.
 * @param senderId Address that is sending the asset.
 * @param receiverId Address that will receive the asset.
 * @param id Asset id.
 * @param receiverData Additional data that will be sent to the receiver.
 */
export default async function(ledger: AssetLedger, senderId: string,  receiverId: string, id: string, receiverData?: string) {
  const functionSignature = typeof receiverData !== 'undefined' ? '0xb88d4fde' : '0x42842e0e';
  const inputTypes = ['address', 'address', 'uint256'];
  if (typeof receiverData !== 'undefined') {
    inputTypes.push('bytes');
  }
  const data = [senderId, receiverId, id, receiverData]
    .filter((a) => typeof a !== 'undefined');
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, data).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
