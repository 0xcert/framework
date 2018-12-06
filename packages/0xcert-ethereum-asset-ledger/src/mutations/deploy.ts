import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeParameters } from '@0xcert/ethereum-utils';
import { AssetLedgerDeployRecipe } from '@0xcert/scaffold';
import xcertAbi from '../config/xcert-abi';

/**
 * Smart contract constructir abi.
 */
const abi = xcertAbi.find((a) => (
  a.type === 'constructor'
));

/**
 * 
 */
export default async function(provider: GenericProvider, { source, name, symbol, uriBase, schemaId }: AssetLedgerDeployRecipe) {
  const attrs = {
    from: provider.accountId,
    data: `${source}${encodeParameters(abi.inputs, [name, symbol, uriBase, schemaId]).substr(2)}`,
  };
  const res = await provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(provider, res.result);
}
