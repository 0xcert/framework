/**
 * 
 */
export interface IChain {
  perform(req: IChainRequest): (IChainResponse | Promise<IChainResponse>);
}

/**
 * 
 */
export enum ChainAction {
  FOLDER_READ_METADATA = 'chainActionFolderReadMetadata',
  FOLDER_READ_SUPPLY = 'chainActionFolderReadSupply',
  FOLDER_READ_CAPABILITIES = 'chainActionFolderReadCapabilities',
}

/**
 * 
 */
export type IChainRequest = IFolderReadMetadataChainRequest
  | IFolderReadSupplyChainRequest
  | IFolderReadCapabilitiesChainRequest;

/**
 * 
 */
export type IChainResponse = IFolderReadMetadataChainResponse
  | IFolderReadSupplyChainResponse
  | IFolderReadCapabilitiesChainResponse;

/**
 * 
 */
export interface IFolderReadMetadataChainRequest {
  action: ChainAction.FOLDER_READ_METADATA;
  folderId: string;
}

/**
 * 
 */
export interface IFolderReadMetadataChainResponse {
  name: string;
  symbol: string;
}

/**
 * 
 */
export interface IFolderReadSupplyChainRequest {
  action: ChainAction.FOLDER_READ_SUPPLY;
  folderId: string;
}

/**
 * 
 */
export interface IFolderReadSupplyChainResponse {
  totalCount: number;
}

/**
 * 
 */
export interface IFolderReadCapabilitiesChainRequest {
  action: ChainAction.FOLDER_READ_CAPABILITIES;
  folderId: string;
}

/**
 * 
 */
export interface IFolderReadCapabilitiesChainResponse {
  isBurnable: boolean;
  isMutable: boolean;
  isPausable: boolean;
  isRevokable: boolean;
}
