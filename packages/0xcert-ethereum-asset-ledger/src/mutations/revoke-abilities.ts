import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import { AssetLedgerAbility } from '@0xcert/scaffold';
import xcertAbi from '../config/xcertAbi';

export default async function(ledger: AssetLedger, accountId: string, abilities: AssetLedgerAbility[]) {

  const abi = xcertAbi.find((a) => (
    a.name === 'revokeAbilities' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_sendTransaction',
    params: [
      {
        from: ledger.provider.accountId,
        to: ledger.id,
        data: encodeFunctionCall(abi, [accountId, abilities]),
        gas: 6000000,
      },
    ],
  }).then((txId) => {
    return new Mutation(ledger.provider, txId.result);
  });
}
