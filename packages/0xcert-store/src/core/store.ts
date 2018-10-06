/**
 * 
 */
export interface IStore {
  perform(req: IStoreRequest): (IStoreResponse | Promise<IStoreResponse>);
}

/**
 * 
 */
export enum StoreAction {
  FILE_CREATE = 'storeActionFileCreate',
  FILE_UPDATE = 'storeActionFileUpdate',
  FILE_DELETE = 'storeActionFileDelete',
}

/**
 * 
 */
export type IStoreRequest = IFileCreateStoreRequest
  | IFileUpdateStoreRequest
  | IFileDeleteStoreRequest;

/**
 * 
 */
export type IStoreResponse = IFileCreateStoreResponse
  | IFileUpdateStoreResponse
  | IFileDeleteStoreResponse;

/**
 * 
 */
export interface IFileCreateStoreRequest {
  action: StoreAction.FILE_CREATE;
}

/**
 * 
 */
export interface IFileCreateStoreResponse {
  filePath: string;
}

/**
 * 
 */
export interface IFileUpdateStoreRequest {
  action: StoreAction.FILE_UPDATE;
}

/**
 * 
 */
export interface IFileUpdateStoreResponse {
  filePath: string;
}

/**
 * 
 */
export interface IFileDeleteStoreRequest {
  action: StoreAction.FILE_DELETE;
}

/**
 * 
 */
export interface IFileDeleteStoreResponse {
  filePath: string;
}
