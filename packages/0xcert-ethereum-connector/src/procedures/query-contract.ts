import { decodeParameters, encodeFunctionCall } from 'web3-eth-abi';
import { ContractQueryOptions, RpcResponse } from '../core/types';

/**
 * 
 */
function buildData(abi) {
  return encodeFunctionCall(abi, []);
}

/**
 * 
 */
export function buildParams(options: ContractQueryOptions) {
  return [
    {
      to: options.to,
      data: buildData(options.abi),
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
