import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedgerDeployRecipe } from '@0xcert/scaffold';
import { fetch } from '@0xcert/utils';
import { getInterfaceCode } from '../lib/capabilities';

const inputTypes = ['string', 'string', 'string', 'bytes32', 'bytes4[]'];

/**
 * Deploys a new asset ledger.
 * @param provider Instance of the provider.
 * @param param1 Data needed to deploy a new asset ledger.
 */
export default async function(provider: GenericProvider, { name, symbol, uriBase, schemaId, capabilities }: AssetLedgerDeployRecipe) {
  const contract = await fetch(provider.assetLedgerSource).then((r) => r.json());
  const source = contract.AssetLedger.evm.bytecode.object;
  const codes = (capabilities || []).map((c) => getInterfaceCode(c));
  const attrs = {
    from: provider.accountId,
    data: `${source}${encodeParameters(inputTypes, [name, symbol, uriBase, schemaId, codes]).substr(2)}`,
  };
  const res = await provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(provider, res.result);
}
