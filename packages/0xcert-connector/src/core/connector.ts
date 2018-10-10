/**
 * 
 */
export interface IConnector {
  perform(req: IActionRequest): (IActionResponse | Promise<IActionResponse>);
}

/**
 * 
 */
export enum ActionId {
  FOLDER_READ_METADATA = 4000,
  FOLDER_READ_SUPPLY = 4001,
  FOLDER_READ_CAPABILITIES = 4002,
  FOLDER_CHECK_IS_PAUSED = 4003,
}

/**
 * 
 */
export type IActionRequest = IFolderReadMetadataConnectorRequest
  | IFolderReadSupplyConnectorRequest
  | IFolderReadCapabilitiesConnectorRequest
  | IFolderCheckIsPausedConnectorRequest;

/**
 * 
 */
export type IActionResponse = IFolderReadMetadataConnectorResponse
  | IFolderReadSupplyConnectorResponse
  | IFolderReadCapabilitiesConnectorResponse
  | IFolderCheckIsPausedConnectorResponse;

/**
 * 
 */
export interface IFolderReadMetadataConnectorRequest {
  actionId: ActionId.FOLDER_READ_METADATA;
  folderId: string;
}

/**
 * 
 */
export interface IFolderReadMetadataConnectorResponse {
  name: string;
  symbol: string;
}

/**
 * 
 */
export interface IFolderReadSupplyConnectorRequest {
  actionId: ActionId.FOLDER_READ_SUPPLY;
  folderId: string;
}

/**
 * 
 */
export interface IFolderReadSupplyConnectorResponse {
  totalCount: number;
}

/**
 * 
 */
export interface IFolderReadCapabilitiesConnectorRequest {
  actionId: ActionId.FOLDER_READ_CAPABILITIES;
  folderId: string;
}

/**
 * 
 */
export interface IFolderReadCapabilitiesConnectorResponse {
  isBurnable: boolean;
  isMutable: boolean;
  isPausable: boolean;
  isRevokable: boolean;
}

/**
 * 
 */
export interface IFolderCheckIsPausedConnectorRequest {
  actionId: ActionId.FOLDER_CHECK_IS_PAUSED;
  folderId: string;
}

/**
 * 
 */
export interface IFolderCheckIsPausedConnectorResponse {
  isPaused: boolean;
}
