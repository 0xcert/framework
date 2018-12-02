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
export enum MutationEvent {
  RESOLVE = 'resolve',
  ERROR = 'error',
  CONFIRM = 'confirm',
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
export interface SendOptions {
  method: string;
  params: any[];
  id?: number;
  jsonrpc?: string;
}
