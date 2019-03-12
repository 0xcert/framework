/**
 * Signature kinds.
 */
export enum SignMethod {
  ETH_SIGN = 0,
  PERSONAL_SIGN = 1,
  TREZOR = 2,
  EIP712 = 3,
}

/**
 * Rpc response definition.
 */
export interface RpcResponse {

  /**
   * RPC request identifier.
   */
  id: number;

  /**
   * RPC protocol version.
   */
  jsonrpc: string;

  /**
   * Response data.
   */
  result: any;
}

/**
 * Send option definition.
 */
export interface SendOptions {

  /**
   * RPC procedure name.
   */
  method: string;

  /**
   * RPC procedure parameters.
   */
  params: any[];

  /**
   * RPC request identifier.
   */
  id?: number;

  /**
   * RPC protocol version.
   */
  jsonrpc?: string;
}
