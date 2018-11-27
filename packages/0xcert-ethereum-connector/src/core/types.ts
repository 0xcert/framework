/**
 * 
 */
export enum SignMethod {
  ETH_SIGN = 0,
  TREZOR = 1,
  EIP712 = 2,
}

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
  to: string;
  abi: {[key: string]: any};
  data: any;
  from?: string;
}

/**
 * 
 */
export interface ContractQueryOptions {
  to: string;
  abi: {[key: string]: any};
  tag: QuantityTag;
  data?: any;
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
export interface SignOptions {
  message: string;
  from?: string;
  signMethod?: SignMethod;
}

/**
 * 
 */
export type QuantityTag = 'earliest' | 'pending' | 'latest' | number;