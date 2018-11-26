/**
 * 
 */
export interface RpcResponse {
  id: number;
  jsonrpc: string;
  result: any;
}

/**
 * 
 */
export interface BlockObject {
  number: number;
  hash: string;
  nonce: number;
  timestamp: number;
}

/**
 * 
 */
export interface TransactionObject {
  blockHash: string;
  blockNumber: number;
  from: string;
  hash: string;
  nonce: number
  to: string;
  transactionIndex: number;
}

/**
 * 
 */
export interface ContractMutationOptions {
  from: string;
  to: string;
  abi: {[key: string]: any};
  data: any;
}

/**
 * 
 */
export interface ContractQueryOptions {
  to: string;
  abi: {[key: string]: any};
  tag: QuantityTag;
}

/**
 * 
 */
export interface SendOptions {
  method: string;
  params: any[];
  id?: number;
  jsonrpc?: string;
}

/**
 * 
 */
export type QuantityTag = 'earliest' | 'pending' | 'latest' | number;