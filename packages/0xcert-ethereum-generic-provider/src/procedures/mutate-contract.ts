import { encodeFunctionCall } from 'web3-eth-abi';
import { RpcResponse, ContractMutationOptions } from '../core/types';

/**
 * 
 */
export function buildParams(options: ContractMutationOptions) {
  return [
    {
      from: options.from,
      to: options.to,
      data: encodeFunctionCall(options.abi, options.data || []),
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
