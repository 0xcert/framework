import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';
import { encodeFunctionCall } from 'web3-eth-abi';
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
export default async function(ledger: AssetLedger, accountId: string, assetId: string) {

  const abi = xcertAbi.find((a) => (
    a.name === 'approve' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_sendTransaction',
    params: [
      {
        from: ledger.provider.accountId,
        to: ledger.id,
        data: encodeFunctionCall(abi, [accountId, assetId]),
        gas: 6000000,
      },
    ],
  }).then((txId) => {
    return new Mutation(ledger.provider, txId.result);
  });
}
