import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { encodeParameters } from '@0xcert/ethereum-utils';
import { ValueLedgerDeployRecipe } from '@0xcert/scaffold';
import { fetch } from '@0xcert/utils';
import erc20Abi from '../config/erc20-abi';

/**
 * Smart contract constructor abi.
 */
const abi = erc20Abi.find((a) => (
  a.type === 'constructor'
));

/**
 * Deploys a new value ledger.
 * @param provider Instance of the provider.
 * @param param1 Data needed to deploy a new value ledger.
 */
export default async function(provider: GenericProvider, { name, symbol, decimals, supply }: ValueLedgerDeployRecipe) {
  const contract = await fetch(provider.valueLedgerSource).then((r) => r.json());
  const source = contract.ValueLedger.evm.bytecode.object;
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
