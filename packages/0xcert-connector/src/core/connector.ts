/**
 * 
 */
export interface IConnector {
  perform(req: IConnectorRequest): (IConnectorResponse | Promise<IConnectorResponse>);
}

/**
 * 
 */
export enum ConnectorAction {
  FOLDER_READ_METADATA = 'connectorActionFolderReadMetadata',
  FOLDER_READ_SUPPLY = 'connectorActionFolderReadSupply',
  FOLDER_READ_CAPABILITIES = 'connectorActionFolderReadCapabilities',
  FOLDER_CHECK_IS_PAUSED = 'connectorActionFolderCheckIsPaused',
}

/**
 * 
 */
export type IConnectorRequest = IFolderReadMetadataConnectorRequest
  | IFolderReadSupplyConnectorRequest
  | IFolderReadCapabilitiesConnectorRequest
  | IFolderCheckIsPausedConnectorRequest;

/**
 * 
 */
export type IConnectorResponse = IFolderReadMetadataConnectorResponse
  | IFolderReadSupplyConnectorResponse
  | IFolderReadCapabilitiesConnectorResponse
  | IFolderCheckIsPausedConnectorResponse;

/**
 * 
 */
export interface IFolderReadMetadataConnectorRequest {
  action: ConnectorAction.FOLDER_READ_METADATA;
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
  action: ConnectorAction.FOLDER_READ_SUPPLY;
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
  action: ConnectorAction.FOLDER_READ_CAPABILITIES;
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
  action: ConnectorAction.FOLDER_CHECK_IS_PAUSED;
  folderId: string;
}

/**
 * 
 */
export interface IFolderCheckIsPausedConnectorResponse {
  isPaused: boolean;
}
