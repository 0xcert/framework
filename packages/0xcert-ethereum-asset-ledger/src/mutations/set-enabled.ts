import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0xbedb86fb';
const inputTypes = ['bool'];

/**
 * Allows or freezes the option of transferring assets in specifies asset ledger.
 * @param ledger Asset ledger instance.
 * @param enabled Enable state.
 */
export default async function(ledger: AssetLedger, enabled: boolean) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [!enabled]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
