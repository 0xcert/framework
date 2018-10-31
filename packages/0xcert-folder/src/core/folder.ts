import { QueryBase, MutationBase } from '@0xcert/intents';
import { FolderTransferState } from "./types";

/**
 * 
 */
export interface FolderBase {
  getSupply(): Promise<QueryBase<GetSupplyResult>>;
  setTransferState(state: FolderTransferState, options: MutationOptions): Promise<MutationBase>;
}

/**
 * 
 */
export interface MutationOptions {
  makerId?: string;
}

/**
 * 
 */
export interface GetSupplyResult {
  total: number;
}

/**
 * 
 */
export interface GetTransferStateResult {
  state: FolderTransferState;
}
