import { encodeFunctionCall, decodeParameters } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import { AssetLedgerTransferState } from '@0xcert/scaffold';
import xcertAbi from '../config/xcertAbi';

/**
 * Smart contract method abi.
 */
const abi = xcertAbi.find((a) => (
  a.name === 'isPaused' && a.type === 'function'
));

/**
 * Gets the current transfer state.
 */
export default async function(ledger: AssetLedger) {
  const attrs = {
    to: ledger.id,
    data: encodeFunctionCall(abi, []),
  };
  const res = await ledger.provider.send({
    method: 'eth_call',
    params: [attrs, 'latest'],
  });
  return decodeParameters(abi.outputs, res.result)[0]
    ? AssetLedgerTransferState.DISABLED
    : AssetLedgerTransferState.ENABLED
}
