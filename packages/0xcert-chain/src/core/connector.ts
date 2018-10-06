/**
 * 
 */
export interface IConnector {
  perform(c: IRequest): (IResponse | Promise<IResponse>);
}

/**
 * 
 */
export enum ActionId {
  READ_FOLDER_METADATA = 1001,
  READ_FOLDER_SUPPLY = 1002,
  READ_FOLDER_CAPABILITIES = 1003,
}

/**
 * 
 */
export type IRequest = IReadFolderMetadataRequest
  | IReadFolderSupplyRequest
  | IReadFolderCapabilitiesRequest;

/**
 * 
 */
export type IResponse = IReadFolderMetadataResponse
  | IReadFolderSupplyResponse
  | IReadFolderCapabilitiesResponse;

/**
 * 
 */
export interface IReadFolderMetadataRequest {
  actionId: ActionId.READ_FOLDER_METADATA;
  folderId: string;
}

/**
 * 
 */
export interface IReadFolderMetadataResponse {
  name: string;
  symbol: string;
}

/**
 * 
 */
export interface IReadFolderSupplyRequest {
  actionId: ActionId.READ_FOLDER_SUPPLY;
  folderId: string;
}

/**
 * 
 */
export interface IReadFolderSupplyResponse {
  totalCount: number;
}

/**
 * 
 */
export interface IReadFolderCapabilitiesRequest {
  actionId: ActionId.READ_FOLDER_CAPABILITIES;
  folderId: string;
}

/**
 * 
 */
export interface IReadFolderCapabilitiesResponse {
  isBurnable: boolean;
  isMutable: boolean;
  isPausable: boolean;
  isRevokable: boolean;
}
