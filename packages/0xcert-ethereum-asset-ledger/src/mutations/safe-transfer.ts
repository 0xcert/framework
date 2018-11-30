import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

export default async function(ledger: AssetLedger, to: string, assetId: string, receiverData?: string) {

  const data = [ledger.provider.accountId, to, assetId];
  if (receiverData !== undefined) {
    data.push(receiverData);
  }  

  const abi = xcertAbi.find((a) => (
    a.name === 'safeTransferFrom' && a.inputs.length == data.length
  ));

  return ledger.provider.send({
    method: 'eth_sendTransaction',
    params: [
      {
        from: ledger.provider.accountId,
        to: ledger.id,
        data: encodeFunctionCall(abi, data),
        gas: 6000000,
      },
    ],
  }).then((txId) => {
    return new Mutation(ledger.provider, txId.result);
  });
}
