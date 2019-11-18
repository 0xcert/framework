import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerDeployRecipe } from '@0xcert/scaffold';
import { fetchJson } from '@0xcert/utils';
import { getInterfaceCode } from '../lib/capabilities';

const inputTypes = ['string', 'string', 'string', 'string', 'bytes32', 'bytes4[]'];

/**
 * Deploys a new asset ledger.
 * @param provider Instance of the provider.
 * @param param1 Data needed to deploy a new asset ledger.
 */
export default async function(provider: GenericProvider, { name, symbol, uriPrefix, uriPostfix, schemaId, capabilities }: AssetLedgerDeployRecipe) {
  const contract = await fetchJson(provider.assetLedgerSource);
  const source = contract.XcertMock.evm.bytecode.object;
  const codes = (capabilities || []).map((c) => getInterfaceCode(c));
  const attrs = {
    from: provider.accountId,
    data: `0x${source}${provider.encoder.encodeParameters(inputTypes, [name, symbol, uriPrefix, uriPostfix, `0x${schemaId}`, codes]).substr(2)}`,
  };
  const res = await provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(provider, res.result);
}
