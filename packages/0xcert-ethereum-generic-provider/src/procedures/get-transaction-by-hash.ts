import { RpcResponse, TransactionObject } from "../core/types";

/**
 * 
 */
export function buildParams(hash: string) {
  return [
    hash,
  ];
}

/**
 * 
 */
export function parseResult({ result }: RpcResponse): TransactionObject {
  if (!result) {
    return result;
  }
  else {
    return {
      ...result,
      nonce: parseInt(result.nonce),
      blockNumber: parseInt(result.blockNumber),
      transactionIndex: parseInt(result.transactionIndex),
    };  
  }
} 
