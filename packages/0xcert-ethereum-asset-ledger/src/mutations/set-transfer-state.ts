import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeFunctionCall } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import { AssetLedgerTransferState } from "@0xcert/scaffold";
import xcertAbi from '../config/xcertAbi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'setPause' && a.type === 'function'
));

/**
 * Allows or freezes the option of transfering assets in specifies asset ledger.
 */
export default async function(ledger: AssetLedger, state: AssetLedgerTransferState) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: encodeFunctionCall(abi, [state !== AssetLedgerTransferState.ENABLED]),
    gas: 6000000,
  };
  const res = await ledger.provider.send({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
