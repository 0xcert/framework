import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * Updates asset ledger uri base.
 */
export default async function(ledger: AssetLedger, uriBase: string) {

  const abi = xcertAbi.find((a) => (
    a.name === 'setUriBase' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_sendTransaction',
    params: [
      {
        from: ledger.provider.accountId,
        to: ledger.id,
        data: encodeFunctionCall(abi, [uriBase]),
        gas: 6000000,
      },
    ],
  }).then((txId) => {
    return new Mutation(ledger.provider, txId.result);
  });
}
