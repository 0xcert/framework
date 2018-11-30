import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * Updates asset proof.
 */
export default async function(ledger: AssetLedger, assetId: string, proof: string) {

  const abi = xcertAbi.find((a) => (
    a.name === 'updateTokenProof' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_sendTransaction',
    params: [
      {
        from: ledger.provider.accountId,
        to: ledger.id,
        data: encodeFunctionCall(abi, [assetId, proof]),
        gas: 6000000,
      },
    ],
  }).then((txId) => {
    return new Mutation(ledger.provider, txId.result);
  });
}
