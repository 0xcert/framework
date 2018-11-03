import { Query, Mutation } from "./intents";

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
export enum FolderAbility {
  MANAGE_ABILITIES = 0,
  MINT_ASSET = 1,
  REVOKE_ASSET = 2,
  PAUSE_TRANSFER = 3,
  UPDATE_PROOF = 4,
  SIGN_MINT_CLAIM = 5,
}

/**
 * 
 */
export enum FolderCapability {
  BURNABLE = 1,
  MUTABLE = 2,
  PAUSABLE = 3,
  REVOKABLE = 4,
}

/**
 * 
 */
export interface FolderBase {
  getAbilities(accountId: string): Promise<Query<FolderAbility[]>>;
  getCapabilities(): Promise<Query<FolderCapability[]>>;
  getInfo(): Promise<Query<FolderGetInfoResult>>;
  getSupply(): Promise<Query<number>>;
  getTransferState(): Promise<Query<FolderTransferState>>;
  assignAbilities(accountId: string, abilities: FolderAbility[]);
  revokeAbilities(accountId: string, abilities: FolderAbility[]);
  setTransferState(state: FolderTransferState): Promise<Mutation>;
}

/**
 * 
 */
export interface FolderTransfer {
  folderId: string;
  senderId: string;
  receiverId: string;
  assetId: string;
}

/**
 * 
 */
export interface FolderGetInfoResult {
  name: string;
  symbol: string;
  uriBase: string;
  conventionId: string
}

/**
 * 
 */
export interface FolderGetInfoResult {
  name: string;
  symbol: string;
}
