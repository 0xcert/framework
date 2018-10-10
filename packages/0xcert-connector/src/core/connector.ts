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
  FOLDER_CHECK_IS_ABLE = 4004,
}

/**
 * 
 */
export enum FolderAbilityId {
  MANAGE_ABILITIES = 0,
  MINT_ASSET = 1,
  REVOKE_ASSET = 2,
  PAUSE_TRANSFER = 3,
  UPDATE_PROOF = 4,
  SIGN_MINT_CLAIM = 5,
}

/**
 * 
 */
export type IActionRequest = IFolderReadMetadataActionRequest
  | IFolderReadSupplyActionRequest
  | IFolderReadCapabilitiesActionRequest
  | IFolderCheckIsPausedActionRequest
  | IFolderCheckIsAbleActionRequest;

/**
 * 
 */
export type IActionResponse = IFolderReadMetadataActionResponse
  | IFolderReadSupplyActionResponse
  | IFolderReadCapabilitiesActionResponse
  | IFolderCheckIsPausedActionResponse
  | IFolderCheckIsAbleActionResponse;

/**
 * 
 */
export interface IFolderReadMetadataActionRequest {
  actionId: ActionId.FOLDER_READ_METADATA;
  folderId: string;
}

/**
 * 
 */
export interface IFolderReadMetadataActionResponse {
  name: string;
  symbol: string;
}

/**
 * 
 */
export interface IFolderReadSupplyActionRequest {
  actionId: ActionId.FOLDER_READ_SUPPLY;
  folderId: string;
}

/**
 * 
 */
export interface IFolderReadSupplyActionResponse {
  totalCount: number;
}

/**
 * 
 */
export interface IFolderReadCapabilitiesActionRequest {
  actionId: ActionId.FOLDER_READ_CAPABILITIES;
  folderId: string;
}

/**
 * 
 */
export interface IFolderReadCapabilitiesActionResponse {
  isBurnable: boolean;
  isMutable: boolean;
  isPausable: boolean;
  isRevokable: boolean;
}

/**
 * 
 */
export interface IFolderCheckIsPausedActionRequest {
  actionId: ActionId.FOLDER_CHECK_IS_PAUSED;
  folderId: string;
}

/**
 * 
 */
export interface IFolderCheckIsPausedActionResponse {
  isPaused: boolean;
}

/**
 * 
 */
export interface IFolderCheckIsAbleActionRequest {
  actionId: ActionId.FOLDER_CHECK_IS_ABLE;
  folderId: string;
  abilityId: FolderAbilityId;
  accountId: string;
}

/**
 * 
 */
export interface IFolderCheckIsAbleActionResponse {
  isAble: boolean;
}
