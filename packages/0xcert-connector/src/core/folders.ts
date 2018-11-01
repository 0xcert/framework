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
export interface FolderBase {
  getAbilities(accountId: string): Promise<FolderQuery<FolderAbility[]>>;
  getCapabilities(): Promise<FolderQuery<FolderGetCapabilitiesResult>>;
  getInfo(): Promise<FolderQuery<FolderGetInfoResult>>;
  getSupply(): Promise<FolderQuery<number>>;
  getTransferState(): Promise<FolderQuery<FolderTransferState>>;
  assignAbilities(accountId: string, abilities: FolderAbility[]);
  revokeAbilities(accountId: string, abilities: FolderAbility[]);
  setTransferState(state: FolderTransferState): Promise<FolderMutation>;
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
export interface FolderGetInfoResult {
  name: string;
  symbol: string;
  conventionId: string
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
