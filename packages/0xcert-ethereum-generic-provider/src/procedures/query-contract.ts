import { decodeParameters, encodeFunctionCall } from 'web3-eth-abi';
import { ContractQueryOptions, RpcResponse } from '../core/types';

/**
 * 
 */
export function buildParams(options: ContractQueryOptions) {
  return [
    {
      to: options.to,
      data: encodeFunctionCall(options.abi, options.data || []),
    },
    options.tag,
  ];
}

/**
 * 
 */
export function parseResult({ abi }: ContractQueryOptions, { result }: RpcResponse) {
  return decodeParameters(abi.outputs, result);
} 
