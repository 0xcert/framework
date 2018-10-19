/**
 * 
 */
export enum MutationKind {
  FOLDER_SET_TRANSFER_STATE = 5001,
}

/**
 * 
 */
export enum MutationEvent {
  PROPOSAL = 2,
  CONFIRMATION = 3,
  APPROVAL = 4,
}

/**
 * 
 */
export type MutationWatcher = (event: MutationEvent, mutation: MutationBase) => (any | Promise<any>);

/**
 * 
 */
export type MutationRecipe = FolderSetTransferStateRecipe;

/**
 * 
 */
export type MutationResult = FolderSetTransferStateResult;

/**
 * 
 */
export interface MutationBase {
  resolve(): Promise<MutationBase>;
  serialize(): MutationResult;
}

/**
 * 
 */
export interface FolderSetTransferStateRecipe {
  mutationKind: MutationKind.FOLDER_SET_TRANSFER_STATE;
  mutationHash?: string;
  folderId: string;
  makerId: string;
  isEnabled: boolean;
}

/**
 * 
 */
export interface FolderSetTransferStateResult {
  isEnabled: boolean;
}
