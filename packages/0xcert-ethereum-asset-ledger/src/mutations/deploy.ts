import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { AssetLedgerDeployOptions } from '../core/types';
import { encodeParameters } from 'web3-eth-abi';
import xcertAbi from '../config/xcertAbi'

/**
 * 
 */
export default async function(provider: GenericProvider, options: AssetLedgerDeployOptions) {
  const source = '';
  const { inputs } = xcertAbi.find((a) => a.type === 'constructor');
  const params = [
    options.name, options.symbol, options.uriBase, '0x0',
  ];

  return provider.send({
    method: 'eth_sendTransaction',
    params: [
      {
        from: provider.accountId,
        data: `${source}${encodeParameters(inputs, params).substr(2)}`,
        gas: 6000000,
      },
    ],
  }).then((txId) => {
    return new Mutation(provider, txId.result);
  });
}
