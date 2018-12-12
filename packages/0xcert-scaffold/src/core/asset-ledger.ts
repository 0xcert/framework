import { MutationBase } from "./misc";

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
  getAbilities(accountId: string): Promise<AssetLedgerAbility[]>;
  getApprovedAccount(assetId: string): Promise<string>;
  getAssetAccount(assetId: string): Promise<string>;
  getAsset(assetId: string): Promise<AssetLedgerItem>;
  getBalance(accountId: string): Promise<string>;
  getCapabilities(): Promise<AssetLedgerCapability[]>;
  getInfo(): Promise<AssetLedgerInfo>;
  isApprovedAccount(accountId: string, assetId: string): Promise<boolean>;
  isTransferable(): Promise<boolean>;
  isApprovedOperator(accountId: string, operatorId: string): Promise<boolean>;
  approveAccount(accountId: string, tokenId: string): Promise<MutationBase>;
  assignAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<MutationBase>;
  createAsset(recipe: AssetLedgerItemRecipe): Promise<MutationBase>;
  destroyAsset(assetId: string): Promise<MutationBase>;
  revokeAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<MutationBase>;
  revokeAsset(assetId: string): Promise<MutationBase>;
  transferAsset(recipe: AssetLedgerTransferRecipe): Promise<MutationBase>;
  enableTransfer(): Promise<MutationBase>;
  disableTransfer(): Promise<MutationBase>;
  updateAsset(assetId: string, recipe: AssetLedgerObjectUpdateRecipe): Promise<MutationBase>;
  update(recipe: AssetLedgerUpdateRecipe): Promise<MutationBase>;
  approveOperator(accountId: string): Promise<MutationBase>;
  disapproveOperator(accountId: string): Promise<MutationBase>;
}

/**
 * 
 */
export interface AssetLedgerDeployRecipe {
  source: string;
  name: string;
  symbol: string;
  uriBase: string;
  schemaId: string;
  capabilities?: string[];
}

/**
 * 
 */
export interface AssetLedgerItem {
  id: string;
  uri: string;
  imprint: string;
}

/**
 * 
 */
export interface AssetLedgerInfo {
  name: string;
  symbol: string;
  uriBase: string;
  schemaId: string;
  supply: string;
}

/**
 * 
 */
export interface AssetLedgerItemRecipe {
  receiverId: string;
  id: string;
  imprint: string;
}

/**
 * 
 */
export interface AssetLedgerTransferRecipe {
  receiverId: string;
  id: string;
  data?: string;
}

/**
 * 
 */
export interface AssetLedgerObjectUpdateRecipe {
  imprint: string;
}

/**
 * 
 */
export interface AssetLedgerUpdateRecipe {
  uriBase: string;
}
