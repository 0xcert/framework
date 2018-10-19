import { FolderAbilityKind } from './folder';

/**
 * 
 */
export enum QueryKind {
  FOLDER_READ_METADATA = 4000,
  FOLDER_READ_SUPPLY = 4001,
  FOLDER_READ_CAPABILITIES = 4002,
  FOLDER_CHECK_TRANSFER_STATE = 4003,
  FOLDER_CHECK_ABILITY = 4004,
  FOLDER_SET_TRANSFER_STATE = 4005,
}

/**
 * 
 */
export type QueryRecipe = FolderReadMetadataRecipe
  | FolderReadSupplyRecipe
  | FolderReadCapabilitiesRecipe
  | FolderCheckTransferStateRecipe
  | FolderCheckAbilityRecipe;

/**
 * 
 */
export type QueryResult = FolderReadMetadataResult
  | FolderReadSupplyResult
  | FolderReadCapabilitiesResult
  | FolderCheckTransferStateResult
  | FolderCheckAbilityResult;

/**
 * 
 */
export interface QueryBase {
  resolve(): Promise<QueryBase>;
  serialize(): QueryResult;
}

/**
 * 
 */
export interface FolderReadMetadataRecipe {
  queryKind: QueryKind.FOLDER_READ_METADATA;
  folderId: string;
}

/**
 * 
 */
export interface FolderReadMetadataResult {
  name: string;
  symbol: string;
}

/**
 * 
 */
export interface FolderReadSupplyRecipe {
  queryKind: QueryKind.FOLDER_READ_SUPPLY;
  folderId: string;
}

/**
 * 
 */
export interface FolderReadSupplyResult {
  totalCount: number;
}

/**
 * 
 */
export interface FolderReadCapabilitiesRecipe {
  queryKind: QueryKind.FOLDER_READ_CAPABILITIES;
  folderId: string;
}

/**
 * 
 */
export interface FolderReadCapabilitiesResult {
  isBurnable: boolean;
  isMutable: boolean;
  isPausable: boolean;
  isRevokable: boolean;
}

/**
 * 
 */
export interface FolderCheckTransferStateRecipe {
  queryKind: QueryKind.FOLDER_CHECK_TRANSFER_STATE;
  folderId: string;
}

/**
 * 
 */
export interface FolderCheckTransferStateResult {
  isEnabled: boolean;
}

/**
 * 
 */
export interface FolderCheckAbilityRecipe {
  queryKind: QueryKind.FOLDER_CHECK_ABILITY;
  abilityKind: FolderAbilityKind;
  folderId: string;
  accountId: string;
}

/**
 * 
 */
export interface FolderCheckAbilityResult {
  isAble: boolean;
}
