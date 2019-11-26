/**
 * Gateway configuration definition.
 */
export interface GatewayConfig {

  /**
   * Order gateway smart contract address.
   */
  actionsOrderId: string;

  /**
   * Deploy asset ledger gateway smart contract address.
   */
  assetLedgerDeployOrderId: string;

  /**
   * Deploy value ledger gateway smart contract address.
   */
  valueLedgerDeployOrderId: string;
}

/**
 * Signature kinds.
 */
export enum SignMethod {
  ETH_SIGN = 0,
  TREZOR = 1,
  NO_PREFIX = 2,
  PERSONAL_SIGN = 3,
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

/**
 * Mutation event signature definition.
 */
export interface MutationEventSignature {
  topic: string;
  name: string;
  types: MutationEventType[];
}

/**
 * Mutation event type definition.
 */
export interface MutationEventType {
  kind: MutationEventTypeKind;
  name: string;
  type: string;
}

/**
 * Mutation event type kind definition.
 */
export enum MutationEventTypeKind {
  NORMAL = 0,
  INDEXED = 1,
}

/**
 * Network kind.
 */
export enum NetworkKind {
  LIVE,
  ROPSTEN,
  RINKEBY,
}
