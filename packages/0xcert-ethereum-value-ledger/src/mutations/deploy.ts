import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeParameters } from '@0xcert/ethereum-utils';
import { ValueLedgerDeployRecipe } from '@0xcert/scaffold';
import { fetch } from '@0xcert/utils';

const inputTypes = ['string', 'string', 'uint8', 'uint256'];

/**
 * Deploys a new value ledger.
 * @param provider Instance of the provider.
 * @param param1 Data needed to deploy a new value ledger.
 */
export default async function(provider: GenericProvider, { name, symbol, decimals, supply }: ValueLedgerDeployRecipe) {
  const contract = await fetch(provider.valueLedgerSource).then((r) => r.json());
  const source = contract.TokenMock.evm.bytecode.object;
  const attrs = {
    from: provider.accountId,
    data: `0x${source}${encodeParameters(inputTypes, [ name, symbol, decimals, supply]).substr(2)}`,
  };
  const res = await provider.post({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(provider, res.result);
}
