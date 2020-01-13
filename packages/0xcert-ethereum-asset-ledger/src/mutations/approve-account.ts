import { Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedger } from '../core/ledger';

const functionSignature = '0x095ea7b3';
const inputTypes = ['address', 'uint256'];

/**
 * Approves an account for transferring a specific token.
 * @param ledger Asset ledger instance.
 * @param accountId Account address.
 * @param assetId Token id.
 */
export default async function(ledger: AssetLedger, accountId: string, assetId: string) {
  const attrs = {
    from: ledger.provider.accountId,
    to: ledger.id,
    data: functionSignature + ledger.provider.encoder.encodeParameters(inputTypes, [accountId, assetId]).substr(2),
  };
  const res = await ledger.provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(ledger.provider, res.result, ledger);
}
