import { GatewayBase } from './gateway';
import { MutationBase } from './mutation';

export type AssetLedgerAbility = SuperAssetLedgerAbility | GeneralAssetLedgerAbility;

/**
 * List of available general abilities an account can have per asset ledger. General abilities are
 * abilities that can not change other account's abilities.
 */
export enum GeneralAssetLedgerAbility {
  CREATE_ASSET = 16,
  REVOKE_ASSET = 32,
  TOGGLE_TRANSFERS = 64,
  UPDATE_ASSET = 128,
  UPDATE_URI_BASE = 256,
  ALLOW_CREATE_ASSET = 512,
  ALLOW_UPDATE_ASSET_IMPRINT = 1024,
}

/**
 * List of available super abilities an account can have per asset ledger. Super abilities are
 * abilities that can change other account's abilities.
 */
export enum SuperAssetLedgerAbility {
  MANAGE_ABILITIES = 1,
  ALLOW_MANAGE_ABILITIES = 2,
}

/**
 * List of available asset ledger capabilities.
 */
export enum AssetLedgerCapability {
  DESTROY_ASSET = 1,
  UPDATE_ASSET = 2,
  REVOKE_ASSET = 4,
  TOGGLE_TRANSFERS = 3,
}

/**
 * Asset ledger method definitions.
 */
export interface AssetLedgerBase {

  /**
   * AssetLedger Id. Address pointing at the smartcontract.
   */
  readonly id: string;

  /**
   * Approves another account so it can transfer the specific asset.
   * @param assetId Id of the asset.
   * @param accountId Id of the account.
   */
  approveAccount(assetId: string, accountId: string | GatewayBase): Promise<MutationBase>;

  /**
   * Approves an account as an operator (meaning he has full controll of all of your assets).
   * @param accountId Account id.
   */
  approveOperator(accountId: string | GatewayBase): Promise<MutationBase>;

  /**
   * Grants abilities of an account.
   * @param accountId Id of the account.
   * @param abilities List of the abilities.
   */
  grantAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<MutationBase>;

  /**
   * Creates a new asset.
   * @param recipe Data from which the new asset is created.
   */
  createAsset(recipe: AssetLedgerItemRecipe): Promise<MutationBase>;

  /**
   * Destoys an existing asset (only asset owner can do this).
   * @param assetId Id of the asset.
   */
  destroyAsset(assetId: string): Promise<MutationBase>;

  /**
   * Disapproves approved account for a specific asset.
   * @param assetId Asset id.
   */
  disapproveAccount(assetId: string): Promise<MutationBase>;

  /**
   * Disapproves an account as an operator.
   * @param accountId Account id.
   */
  disapproveOperator(accountId: string | GatewayBase): Promise<MutationBase>;

  /**
   * Disables transfers of asset on the asset ledger.
   */
  disableTransfers(): Promise<MutationBase>;

  /**
   * Enables transfers of asset on the asset ledger.
   */
  enableTransfers(): Promise<MutationBase>;

  /**
   * Gets a list of abilities an account has for this asset ledger.
   * @param accountId Account address for wich we want to get abilities.
   */
  getAbilities(accountId: string): Promise<AssetLedgerAbility[]>;

  /**
   * Gets accountId if anyone is approved for this asset.
   * @param assetId Id of the asset.
   */
  getApprovedAccount(assetId: string): Promise<string>;

  /**
   * Gets information about the asset(id, uri, imprint).
   * @param assetId Id of the asset.
   */
  getAsset(assetId: string): Promise<AssetLedgerItem>;

  /**
   * Gets the asset owner account ID.
   * @param assetId Id of the asset.
   */
  getAssetAccount(assetId: string): Promise<string>;

  /**
   * Gets the count of assets an account owns.
   * @param accountId Address for which we want asset count.
   */
  getBalance(accountId: string): Promise<string>;

  /**
   * Gets a list of all asset ledger capabilities(options).
   */
  getCapabilities(): Promise<AssetLedgerCapability[]>;

  /**
   * Gets information about the asset ledger (name, symbol, uriPrefix, schemaId, supply).
   */
  getInfo(): Promise<AssetLedgerInfo>;

  /**
   * Checks if a specific account is approved for a specific asset.
   * @param assetId Id of the asset.
   * @param accountId Id of the account.
   */
  isApprovedAccount(assetId: string, accountId: string | GatewayBase): Promise<boolean>;

  /**
   * Checks if specific account is the operator for specific account.
   * @param accountId Account id.
   * @param operatorId Operator account id.
   */
  isApprovedOperator(accountId: string, operatorId: string | GatewayBase): Promise<boolean>;

  /**
   * Checks if transfers on the asset ledger are enabled.
   */
  isTransferable(): Promise<boolean>;

  /**
   * Removes abilities from account.
   * @param accountId Id of the account.
   * @param abilities List of the abilities.
   */
  revokeAbilities(accountId: string, abilities: AssetLedgerAbility[]): Promise<MutationBase>;

  /**
   * Destroys an existing asset (only someone with asset ledger revoke ability can do this).
   * @param assetId If of the asset.
   */
  revokeAsset(assetId: string): Promise<MutationBase>;

  /**
   * Updates asset ledger data.
   * @param recipe Data to update asset ledger with.
   */
  update(recipe: AssetLedgerUpdateRecipe): Promise<MutationBase>;

  /**
   * Updates data on an existing asset.
   * @param assetId Id of the asset.
   * @param recipe Data to update asset with.
   */
  updateAsset(assetId: string, recipe: AssetLedgerObjectUpdateRecipe): Promise<MutationBase>;

  /**
   * Transfers asset to another account.
   * @param recipe Data needed for the transfer.
   */
  transferAsset(recipe: AssetLedgerTransferRecipe): Promise<MutationBase>;

}

/**
 * Asset ledger deploy data definition.
 */
export interface AssetLedgerDeployRecipe {

  /**
   * Asset Ledger name.
   */
  name: string;

  /**
   * Asset Ledger symbol/ticker.
   */
  symbol: string;

  /**
   * Uri prefix for metadata URI-s. At the end of the prefix the assetId is automatically appended for each asset.
   * Example: https://example.com/id/
   * Asset 1 URI will become: https://example.com/id/1 + postfix
   */
  uriPrefix: string;

  /**
   * URI postfix for metadata URIs. After uriPrefix and assetId, postfix is automatically appended for each asset..
   * Example: .json
   * Asset 1 URI will become: uriPrefix + 1.json
   */
  uriPostfix: string;

  /**
   * Hashed representation of JSON schema defining this object.
   */
  schemaId: string;

  /**
   * Array representing capabilities.
   */
  capabilities?: AssetLedgerCapability[];
}

/**
 * Asset data definition.
 */
export interface AssetLedgerItem {

  /**
   * Unique asset Id.
   */
  id: string;

  /**
   * Uri poiting to the asset metadata (is automatically generated based on baseUri).
   */
  uri: string;

  /**
   * Merkle tree root of asset proof.
   */
  imprint: string;

  /**
   * Hashed representation of JSON schema defining this object.
   */
  schemaId: string;
}

/**
 * Asset ledger data definition.
 */
export interface AssetLedgerInfo {

  /**
   * Asset Ledger name.
   */
  name: string;

  /**
   * Asset Ledger symbol/ticker.
   */
  symbol: string;

  /**
   * Uri prefix for metadata URI-s. At the end of the prefix the assetId is automatically appended for each asset.
   * Example: https://example.com/id/
   * Asset 1 URI will become: https://example.com/id/1 + postfix
   */
  uriPrefix: string;

  /**
   * URI postfix for metadata URIs. After uriPrefix and assetId, postfix is automatically appended for each asset..
   * Example: .json
   * Asset 1 URI will become: uriPrefix + 1.json
   */
  uriPostfix: string;

  /**
   * Total supply of all assets in this AssetLedger.
   */
  supply: string;
}

/**
 * Asset creation data definition.
 */
export interface AssetLedgerItemRecipe {

  /**
   * Id(address) of the receiver.
   */
  receiverId: string;

  /**
   * Unique asset Id.
   */
  id: string;

  /**
   * Merkle tree root of asset proof.
   */
  imprint: string;
}

/**
 * Asset transfer data definition.
 */
export interface AssetLedgerTransferRecipe {

  /**
   * Id(address) of the sender.
   */
  senderId?: string;

  /**
   * Id(address) of the receiver.
   */
  receiverId: string;

  /**
   * Unique asset Id.
   */
  id: string;

  /**
   * Additional data that will be sent with mutation to the receiver.
   */
  data?: string;
}

/**
 * Asset update data definition.
 */
export interface AssetLedgerObjectUpdateRecipe {

  /**
   * Merkle tree root of asset proof.
   */
  imprint: string;
}

/**
 * Asset ledger update data definition.
 */
export interface AssetLedgerUpdateRecipe {

  /**
   * Uri prefix for metadata URI-s. At the end of the prefix the assetId is automatically appended for each asset.
   * Example: https://example.com/id/
   * Asset 1 URI will become: https://example.com/id/1 + postfix
   */
  uriPrefix: string;

  /**
   * URI postfix for metadata URIs. After uriPrefix and assetId, postfix is automatically appended for each asset..
   * Example: .json
   * Asset 1 URI will become: uriPrefix + 1.json
   */
  uriPostfix: string;
}
