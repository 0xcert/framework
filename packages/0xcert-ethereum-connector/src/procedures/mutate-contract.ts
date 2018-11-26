import { encodeFunctionCall } from 'web3-eth-abi';
import { RpcResponse, ContractMutationOptions } from '../core/types';

/**
 * 
 */
function buildData({ abi, data }: ContractMutationOptions) {
  return encodeFunctionCall(abi, data);
}

/**
 * 
 */
export function buildParams(options: ContractMutationOptions) {
  return [
    {
      from: options.from,
      to: options.to,
      data: buildData(options),
      gas: 6000000,
    },
  ];
}

/**
 * 
 */
export function parseResult({ result }: RpcResponse): string {
  return result;
} 
