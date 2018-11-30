import { encodeFunctionCall, decodeParameters } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import { AssetLedgerTransferState } from '@0xcert/scaffold';
import xcertAbi from '../config/xcertAbi';

/**
 * Gets the current transfer state.
 */
export default async function(ledger: AssetLedger) {

  const abi = xcertAbi.find((a) => (
    a.name === 'isPaused' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_call',
    params: [
      {
        to: ledger.id,
        data: encodeFunctionCall(abi, []),
      },
      'latest'
    ],
  }).then(({ result }) => {
    return decodeParameters(abi.outputs, result);
  }).then((r) => {
    return r[0] ? AssetLedgerTransferState.DISABLED : AssetLedgerTransferState.ENABLED;
  });
}
