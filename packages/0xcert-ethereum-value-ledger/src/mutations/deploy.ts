import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeParameters } from '@0xcert/ethereum-utils';
import { ValueLedgerDeployRecipe } from '@0xcert/scaffold';
import erc20Abi from '../config/erc20-abi';

/**
 * Smart contract constructir abi.
 */
const abi = erc20Abi.find((a) => (
  a.type === 'constructor'
));

/**
 * 
 */
export default async function(provider: GenericProvider, { source, name, symbol, decimals, supply }: ValueLedgerDeployRecipe) {
  const attrs = {
    from: provider.accountId,
    data: `${source}${encodeParameters(abi.inputs, [ name, symbol, decimals, supply]).substr(2)}`,
  };
  const res = await provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(provider, res.result);
}
