import { FolderAbilityKind } from './folder';
import { ConnectorError } from './errors';

/**
 * 
 */
export enum QueryKind {
  FOLDER_CHECK_ABILITY = 4001,
  FOLDER_CHECK_APPROVAL = 4002,
  FOLDER_CHECK_TRANSFER_STATE = 4003,
  FOLDER_READ_CAPABILITIES = 4004,
  FOLDER_READ_METADATA = 4005,
  FOLDER_READ_SUPPLY = 4006,
}

export enum QueryEvent {
  REQUEST = 'request',
  RESPONSE = 'response',
  ERROR = 'error',
}

/**
 * 
 */
export interface QueryEmitter {
  on(kind: QueryEvent.REQUEST, handler: (mutation: this) => any);
  on(kind: QueryEvent.RESPONSE, handler: (mutation: this) => any);
  on(kind: QueryEvent.ERROR, handler: (error: ConnectorError, mutation: this) => any);
  off(kind: QueryEvent.REQUEST, handler?: (mutation: this) => any);
  off(kind: QueryEvent.RESPONSE, handler?: (mutation: this) => any);
  off(kind: QueryEvent.ERROR, handler?: (error: ConnectorError, mutation: this) => any);
}

/**
 * 
 */
export interface FolderCheckAbilityQuery extends QueryEmitter {
  resolve(): Promise<this>;
  serialize(): FolderCheckAbilityResult;
}

/**
 * 
 */
export interface FolderCheckApprovalQuery extends QueryEmitter {
  resolve(): Promise<this>;
  serialize(): FolderCheckApprovalResult;
}

/**
 * 
 */
export interface FolderCheckTransferStateQuery extends QueryEmitter {
  resolve(): Promise<this>;
  serialize(): FolderCheckTransferStateResult;
}

/**
 * 
 */
export interface FolderReadCapabilitiesQuery extends QueryEmitter {
  resolve(): Promise<this>;
  serialize(): FolderReadCapabilitiesResult;
}

/**
 * 
 */
export interface FolderReadMetadataQuery extends QueryEmitter {
  resolve(): Promise<this>;
  serialize(): FolderReadMetadataResult;
}

/**
 * 
 */
export interface FolderReadSupplyQuery extends QueryEmitter {
  resolve(): Promise<this>;
  serialize(): FolderReadSupplyResult;
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
export interface FolderCheckApprovalRecipe {
  queryKind: QueryKind.FOLDER_CHECK_APPROVAL;
  folderId: string;
  accountId: string;
  assetId: string;
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
export interface FolderReadCapabilitiesRecipe {
  queryKind: QueryKind.FOLDER_READ_CAPABILITIES;
  folderId: string;
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
export interface FolderReadSupplyRecipe {
  queryKind: QueryKind.FOLDER_READ_SUPPLY;
  folderId: string;
}

/**
 * 
 */
export interface FolderCheckAbilityResult {
  data: {
    isAble: boolean;
  };
}

/**
 * 
 */
export interface FolderCheckApprovalResult {
  data: {
    isApproved: boolean;
  };
}

/**
 * 
 */
export interface FolderCheckTransferStateResult {
  data: {
    isEnabled: boolean;
  };
}

/**
 * 
 */
export interface FolderReadCapabilitiesResult {
  data: {
    isBurnable: boolean;
    isMutable: boolean;
    isPausable: boolean;
    isRevokable: boolean;
  };
}

/**
 * 
 */
export interface FolderReadMetadataResult {
  data: {
    name: string;
    symbol: string;
  };
}

/**
 * 
 */
export interface FolderReadSupplyResult {
  data: {
    totalCount: number;
  };
}
