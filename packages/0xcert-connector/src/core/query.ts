import { FolderAbilityKind } from './folder';
import { ConnectorError } from './errors';

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
export interface FolderReadCapabilitiesQuery extends QueryEmitter {
  resolve(): Promise<this>;
  serialize(): FolderReadCapabilitiesResult;
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
export interface FolderCheckAbilityQuery extends QueryEmitter {
  resolve(): Promise<this>;
  serialize(): FolderCheckAbilityResult;
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
  data: {
    name: string;
    symbol: string;
  };
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
  data: {
    totalCount: number;
  };
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
export interface FolderCheckTransferStateRecipe {
  queryKind: QueryKind.FOLDER_CHECK_TRANSFER_STATE;
  folderId: string;
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
  data: {
    isAble: boolean;
  };
}
