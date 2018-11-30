import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerDeployOptions } from '../core/types';
import { encodeParameters } from 'web3-eth-abi';
import xcertAbi from '../config/xcertAbi'

/**
 * Smart contract constructir abi.
 */
const abi = xcertAbi.find((a) => (
  a.type === 'constructor'
));

/**
 * 
 */
export default async function(provider: GenericProvider, { source, name, symbol, uriBase, conventionId }: AssetLedgerDeployOptions) {
  const attrs = {
    from: provider.accountId,
    data: `${source}${encodeParameters(abi.inputs, [name, symbol, uriBase, conventionId]).substr(2)}`,
    gas: 6000000,
  };
  const res = await provider.send({
    method: 'eth_sendTransaction',
    params: [attrs],
  });
  return new Mutation(provider, res.result);
}
