import { EventEmitter } from 'eventemitter3';
import { ConnectorBase } from './connector';

export enum MutationKind {
  FOLDER_SET_TRANSFER_STATE = 5001,
}

export enum MutationEvent {
  REQUEST = 'request',
  RESPONSE = 'response',
  CONFIRMATION = 'confirmation',
  APPROVAL = 'approval',
  ERROR = 'error',
}

export type MutationRecipe = FolderSetTransferStateRecipe;

export type MutationResult = FolderSetTransferStateResult;

export type MutationIntent = FolderSetTransferStateIntent;

export interface FolderSetTransferStateIntent extends MutationEmitter {
  resolve(): Promise<this>;
  serialize(): FolderSetTransferStateResult;
}

export interface FolderSetTransferStateRecipe {
  mutationKind: MutationKind.FOLDER_SET_TRANSFER_STATE;
  mutationId?: string;
  folderId: string;
  makerId: string;
  data: {
    isEnabled: boolean;
  };
}

export interface FolderSetTransferStateResult {
  mutationId: string;
  data: {
    isEnabled: boolean;
  };
}

export class MutationEmitter extends EventEmitter {
  public on(kind: MutationEvent.REQUEST, handler: (mutation: this) => any);
  public on(kind: MutationEvent.RESPONSE, handler: (mutation: this) => any);
  public on(kind: MutationEvent.CONFIRMATION, handler: (count: number, mutation: this) => any);
  public on(kind: MutationEvent.APPROVAL, handler: (count: number, mutation: this) => any);
  public on(kind: MutationEvent.ERROR, handler: (error: any, mutation: this) => any);
  on(kind, handler) { return super.on(kind, handler) }
  public off(kind: MutationEvent.REQUEST, handler?: (mutation: this) => any);
  public off(kind: MutationEvent.RESPONSE, handler?: (mutation: this) => any);
  public off(kind: MutationEvent.CONFIRMATION, handler?: (count: number, mutation: this) => any);
  public off(kind: MutationEvent.APPROVAL, handler?: (count: number, mutation: this) => any);
  public off(kind: MutationEvent.ERROR, handler?: (error: any, mutation: this) => any);
  off(kind, handler) { super.off(kind, handler) }
}
