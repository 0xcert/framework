/**
 * 
 */
export enum FolderTransferState {
  DISABLED = 0,
  ENABLED = 1,
}

/**
 * 
 */
export interface FolderBase {
  getSupply(): Promise<FolderQuery<FolderGetSupplyResult>>;
  getTransferState(): Promise<FolderQuery<GetTransferStateResult>>;
}

/**
 * 
 */
export interface FolderQuery<T> {
  result: T;
}

/**
 * 
 */
export interface FolderMutation {
  transactionId: string;
}

/**
 * 
 */
export interface FolderGetSupplyResult {
  total: number;
}

/**
 * 
 */
export interface GetTransferStateResult {
  state: FolderTransferState;
}

/**
 * 
 */
export interface FolderGetInfoResult {
  name: string;
  symbol: string;
}

/**
 * 
 */
export interface FolderGetCapabilitiesResult {
  isBurnable: boolean;
  isMutable: boolean;
  isPausable: boolean;
  isRevokable: boolean;
}
