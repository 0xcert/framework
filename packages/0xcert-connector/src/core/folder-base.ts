import { FolderTransferState } from "./folder-transfer-state";
import { QueryBase } from "./query-base";
import { MutationBase } from "./mutation-base";
import { GetSupplyResult } from "../results/get-supply-result";
import { MutationOptions } from "./mutation-options";

export interface FolderBase {
  getSupply(): Promise<QueryBase<GetSupplyResult>>;
  setTransferState(state: FolderTransferState, options: MutationOptions): Promise<MutationBase>;
}
