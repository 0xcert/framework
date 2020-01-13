import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0x89b73ec0';
const inputTypes = ['string', 'string'];

/**
 * Updates asset ledger URI base.
 * @param ledger Asset ledger instance.
 * @param uriPrefix New URI base.
 */
export default async function(ledger: AssetLedger, uriPrefix: string, uriPostfix: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [uriPrefix, uriPostfix]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
