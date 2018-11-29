import { RpcResponse, QuantityTag, BlockObject } from "../core/types";

/**
 * 
 */
export function buildParams(tag: QuantityTag) {
  return [
    tag, 
    false,
  ];
}

/**
 * 
 */
export function parseResult({ result }: RpcResponse): BlockObject {
  if (!result) {
    return result;
  }
  else {
    return {
      ...result,
      number: parseInt(result.number),
      nonce: parseInt(result.nonce),
      timestamp: parseInt(result.timestamp),
    };
  } 
} 
