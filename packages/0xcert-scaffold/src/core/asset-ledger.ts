import { Query, Mutation, ContextBase } from "./context";

/**
 * 
 */
export enum AssetLedgerAbility {
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
export enum AssetLedgerTransferState {
  DISABLED = 0,
  ENABLED = 1,
}

/**
 * 
 */
export enum AssetLedgerCapability {
  BURNABLE = 1,
  MUTABLE = 2,
  PAUSABLE = 3,
  REVOKABLE = 4,
}

/**
 * 
 */
export interface AssetLedgerBase {
  readonly id: string;
  getAbilities(accountId: string): Promise<Query<AssetLedgerAbility[]>>;
  getCapabilities(): Promise<Query<AssetLedgerCapability[]>>;
  getInfo(): Promise<Query<AssetLedgerGetInfoResult>>;
  getSupply(): Promise<Query<number>>;
  getTransferState(): Promise<Query<AssetLedgerTransferState>>;
  assignAbilities(accountId: string, abilities: AssetLedgerAbility[]);
  revokeAbilities(accountId: string, abilities: AssetLedgerAbility[]);
  setTransferState(state: AssetLedgerTransferState): Promise<Mutation>;
}

/**
 * 
 */
export interface AssetLedgerGetInfoResult {
  name: string;
  symbol: string;
  uriBase: string;
  conventionId: string
}
