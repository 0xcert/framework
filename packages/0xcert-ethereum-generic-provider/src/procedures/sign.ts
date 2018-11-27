import { RpcResponse, SignOptions } from '../core/types';

/**
 * 
 */
export function buildParams(options: SignOptions) {
  return [
    options.from,
    options.message,
  ];
}

/**
 * 
 */
export function parseResult(options: SignOptions, { result }: RpcResponse) {
  return `${options.signMethod}:${result}`;
} 
