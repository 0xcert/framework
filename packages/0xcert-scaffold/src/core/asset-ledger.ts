import { MutationBase } from "./misc";
import { OrderGatewayBase } from "./order-gateway";

/**
 * List of available abilities an account can have per asset ledger.
 */
export enum AssetLedgerAbility {
  MANAGE_ABILITIES = 0,
  CREATE_ASSET = 1,
  REVOKE_ASSET = 2,
  TOGGLE_TRANSFERS = 3,
  UPDATE_ASSET = 4,
  UPDATE_URI_BASE = 6,
}

/**
 * List of available asset ledger capabilities.
 */
export enum AssetLedgerCapability {
  BURN_ASSET = 1,
  UPDATE_ASSET = 2,
  REVOKE_ASSET = 4,
  TOGGLE_TRANSFERS = 3,
}

/**
 * Asset ledger method definitions.
 */
export interface AssetLedgerBase {
  readonly id: string;
  approveAccount(assetId: string, accountId: string | OrderGatewayBase): Promise<MutationBase>;
  approveOperator(accountId: string | OrderGatewayBase): Promise<MutationBase>;
  assignAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<MutationBase>;
  createAsset(recipe: AssetLedgerItemRecipe): Promise<MutationBase>;
  destroyAsset(assetId: string): Promise<MutationBase>;
  disapproveAccount(assetId: string): Promise<MutationBase>;
  disapproveOperator(accountId: string | OrderGatewayBase): Promise<MutationBase>;
  disableTransfers(): Promise<MutationBase>;
  enableTransfers(): Promise<MutationBase>;
  getAbilities(accountId: string): Promise<AssetLedgerAbility[]>;
  getApprovedAccount(assetId: string): Promise<string>;
  getAsset(assetId: string): Promise<AssetLedgerItem>;
  getAssetAccount(assetId: string): Promise<string>;
  getBalance(accountId: string): Promise<string>;
  getCapabilities(): Promise<AssetLedgerCapability[]>;
  getInfo(): Promise<AssetLedgerInfo>;
  isApprovedAccount(assetId: string, accountId: string | OrderGatewayBase): Promise<boolean>;
  isApprovedOperator(accountId: string, operatorId: string | OrderGatewayBase): Promise<boolean>;
  isTransferable(): Promise<boolean>;
  revokeAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<MutationBase>;
  revokeAsset(assetId: string): Promise<MutationBase>;
  update(recipe: AssetLedgerUpdateRecipe): Promise<MutationBase>;
  updateAsset(assetId: string, recipe: AssetLedgerObjectUpdateRecipe): Promise<MutationBase>;
  transferAsset(recipe: AssetLedgerTransferRecipe): Promise<MutationBase>;
}

/**
 * Asset ledger deploy data definition.
 */
export interface AssetLedgerDeployRecipe {
  name: string;
  symbol: string;
  uriBase: string;
  schemaId: string;
  capabilities?: AssetLedgerCapability[];
}

/**
 * Asset data definition.
 */
export interface AssetLedgerItem {
  id: string;
  uri: string;
  imprint: string;
}

/**
 * Asset ledger data definition.
 */
export interface AssetLedgerInfo {
  name: string;
  symbol: string;
  uriBase: string;
  schemaId: string;
  supply: string;
}

/**
 * Asset creation data definition.
 */
export interface AssetLedgerItemRecipe {
  receiverId: string;
  id: string;
  imprint?: string;
}

/**
 * Asset transfer data definition.
 */
export interface AssetLedgerTransferRecipe {
  receiverId: string;
  id: string;
  data?: string;
}

/**
 * Asset update data definition.
 */
export interface AssetLedgerObjectUpdateRecipe {
  imprint: string;
}

/**
 * Asset ledger update data definition.
 */
export interface AssetLedgerUpdateRecipe {
  uriBase: string;
}
