import { ConnectorError } from './errors';

/**
 * 
 */
export enum MutationKind {
  FOLDER_SET_TRANSFER_STATE = 5001,
  FOLDER_SET_URI_BASE = 5002,
}

/**
 * 
 */
export enum MutationEvent {
  REQUEST = 'request',
  RESPONSE = 'response',
  CONFIRMATION = 'confirmation',
  APPROVAL = 'approval',
  ERROR = 'error',
}

/**
 * 
 */
export interface MutationEmitter {
  on(kind: MutationEvent.REQUEST, handler: (mutation: this) => any);
  on(kind: MutationEvent.RESPONSE, handler: (mutation: this) => any);
  on(kind: MutationEvent.CONFIRMATION, handler: (count: number, mutation: this) => any);
  on(kind: MutationEvent.APPROVAL, handler: (count: number, mutation: this) => any);
  on(kind: MutationEvent.ERROR, handler: (error: ConnectorError, mutation: this) => any);
  off(kind: MutationEvent.REQUEST, handler?: (mutation: this) => any);
  off(kind: MutationEvent.RESPONSE, handler?: (mutation: this) => any);
  off(kind: MutationEvent.CONFIRMATION, handler?: (count: number, mutation: this) => any);
  off(kind: MutationEvent.APPROVAL, handler?: (count: number, mutation: this) => any);
  off(kind: MutationEvent.ERROR, handler?: (error: ConnectorError, mutation: this) => any);
}

/**
 * 
 */
export interface FolderSetTransferStateMutation extends MutationEmitter {
  resolve(): Promise<this>;
  serialize(): FolderSetTransferStateResult;
}

/**
 * 
 */
export interface FolderSetUriBaseMutation extends MutationEmitter {
  resolve(): Promise<this>;
  serialize(): FolderSetUriBaseResult;
}

/**
 * 
 */
export interface FolderSetTransferStateRecipe {
  mutationKind: MutationKind.FOLDER_SET_TRANSFER_STATE;
  mutationId?: string;
  folderId: string;
  makerId: string;
  data: {
    isEnabled: boolean;
  };
}

/**
 * 
 */
export interface FolderSetUriBaseRecipe {
  mutationKind: MutationKind.FOLDER_SET_URI_BASE;
  mutationId?: string;
  folderId: string;
  makerId: string;
  data: {
    uriBase: string;
  };
}

/**
 * 
 */
export interface FolderSetTransferStateResult {
  mutationId: string;
  data: {
    isEnabled: boolean;
  };
}

/**
 * 
 */
export interface FolderSetUriBaseResult {
  mutationId: string;
  data: {
    uriBase: string;
  };
}
