import { Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0x27fc0cff';
const inputTypes = ['string'];

/**
 * Updates asset ledger uri base.
 * @param ledger Asset ledger instance.
 * @param uriBase New uri base.
 */
export default async function(ledger: AssetLedger, uriBase: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + encodeParameters(inputTypes, [uriBase]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result);
}
