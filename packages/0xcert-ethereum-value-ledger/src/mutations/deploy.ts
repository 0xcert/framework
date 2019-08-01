import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { ValueLedgerDeployRecipe } from '@0xcert/scaffold';
import { fetchJson } from '@0xcert/utils';

const inputTypes = ['string', 'string', 'uint8', 'uint256'];

/**
 * Deploys a new value ledger.
 * @param provider Instance of the provider.
 * @param param1 Data needed to deploy a new value ledger.
 */
export default async function(provider: GenericProvider, { name, symbol, decimals, supply }: ValueLedgerDeployRecipe) {
  const contract = await fetchJson(provider.valueLedgerSource);
  const source = contract.TokenMock.evm.bytecode.object;
  const attrs = {
    from: provider.accountId,
    data: `0x${source}${provider.encoder.encodeParameters(inputTypes, [ name, symbol, decimals, supply]).substr(2)}`,
  };
  const res = await provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(provider, res.result);
}
