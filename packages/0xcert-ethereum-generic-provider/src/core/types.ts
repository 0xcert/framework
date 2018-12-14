/**
 * Signature kinds.
 */
export enum SignMethod {
  ETH_SIGN = 0,
  TREZOR = 1,
  EIP712 = 2,
}

/**
 * Mutation event kinds.
 */
export enum MutationEvent {
  RESOLVE = 'resolve',
  ERROR = 'error',
  CONFIRM = 'confirm',
}

/**
 * Rpc response definition.
 */
export interface RpcResponse {
  id: number;
  jsonrpc: string;
  result: any;
}

/**
 * Send option definition.
 */
export interface SendOptions {
  method: string;
  params: any[];
  id?: number;
  jsonrpc?: string;
}
