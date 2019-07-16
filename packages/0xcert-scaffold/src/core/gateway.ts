import { AssetLedgerCapability } from './asset-ledger';
import { MutationBase } from './mutation';

/**
 * List of available order action kinds.
 */
export enum MultiOrderActionKind {
  CREATE_ASSET = 1,
  TRANSFER_ASSET = 2,
  TRANSFER_VALUE = 3,
  UPDATE_ASSET_IMPRINT = 4,
}

/**
 * Order gateway method definition.
 */
export interface GatewayBase {

  /**
   * Address of the smart contract that represents this order gateway.
   */
  readonly id: string;

  /**
   * Gets signed claim for an order.
   * @param order Order data.
   */
  claim(order: Order): Promise<string>;

  /**
   * Performs an order.
   * @param order Order data.
   * @param claim Claim data.
   */
  perform(order: Order, claim: string): Promise<MutationBase>;

  /**
   * Cancels an order.
   * @param order Order data.
   */
  cancel(order: Order): Promise<MutationBase>;
}

/**
 * Different order actions.
 */
export type MultiOrderAction = MultiOrderActionCreateAsset | MultiOrderActionTransferAsset
  | MultiOrderActionTransferValue | MultiOrderActionUpdateAssetImprint;

/**
 * Order create asset data definitio.
 */
export interface MultiOrderActionCreateAsset {

  /**
   * Type od order action.
   */
  kind: MultiOrderActionKind.CREATE_ASSET;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the receiver.
   */
  receiverId?: string;

  /**
   * Unique asset Id.
   */
  assetId: string;

  /**
   * Merkle tree root of asset proof.
   */
  assetImprint: string;
}

/**
 * Order transfer asset data definition.
 */
export interface MultiOrderActionTransferAsset {

  /**
   * Type od order action.
   */
  kind: MultiOrderActionKind.TRANSFER_ASSET;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender.
   */
  senderId?: string;

  /**
   * Id (address) of the receiver.
   */
  receiverId?: string;

  /**
   * Unique asset Id.
   */
  assetId: string;
}

/**
 * Order transfer asset data definition.
 */
export interface MultiOrderActionUpdateAssetImprint {

  /**
   * Type od order action.
   */
  kind: MultiOrderActionKind.UPDATE_ASSET_IMPRINT;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Merkle tree root of asset proof.
   */
  assetImprint: string;

  /**
   * Unique asset Id.
   */
  assetId: string;
}

/**
 * Order transfer value data definition.
 */
export interface MultiOrderActionTransferValue {

  /**
   * Type od order action.
   */
  kind: MultiOrderActionKind.TRANSFER_VALUE;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender.
   */
  senderId?: string;

  /**
   * Id (address) of the receiver.
   */
  receiverId?: string;

  /**
   * The amount of value(erc20 tokens).
   */
  value: string; // TODO BN.js
}

/**
 * Different order actions.
 */
export type Order = MultiOrder | AssetLedgerDeployOrder;

/**
 * List of available order kinds.
 */
export enum OrderKind {
  MULTI_ORDER = 1,
  ASSET_LEDGER_DEPLOY_ORDER = 2,
}

/**
 * Order definition.
 */
export class MultiOrder {

  /**
   * Type of order.
   */
  public kind: OrderKind.MULTI_ORDER;

  /**
   * Address of the order maker.
   */
  public makerId: string;

  /**
   * Address of the order taker.
   */
  public takerId?: string;

  /**
   * Array of actions that will execute in this order.
   */
  public actions: MultiOrderAction[];

  /**
   * Nonce for hash generation - usually current timestamp.
   */
  public seed: number;

  /**
   * Timestamp of order expiration.
   */
  public expiration: number;
}

/**
 * Deploy definition.
 */
export class AssetLedgerDeployOrder {

  /**
   * Type of order.
   */
  public kind: OrderKind.ASSET_LEDGER_DEPLOY_ORDER;

  /**
   * Address of the order maker.
   */
  public makerId: string;

  /**
   * Address of the order taker.
   */
  public takerId?: string;

  /**
   * Data from which a new asset ledger will be created.
   */
  public assetLedgerData: AssetLedgerData;

  /**
   * Data defining a fungible token transfer.
   */
  public tokenTransferData: TokenTransferData;

  /**
   * Nonce for hash generation - usually current timestamp.
   */
  public seed: number;

  /**
   * Timestamp of order expiration.
   */
  public expiration: number;
}

/**
 * Asset ledger deploy data definition.
 */
export interface AssetLedgerData {

  /**
   * Asset Ledger name.
   */
  name: string;

  /**
   * Asset Ledger symbol/ticker.
   */
  symbol: string;

  /**
   * Uri base for metadata URI-s. At the end of the base the assetId is automatically appended foo each asset.
   * Example: https://example.com/id/
   * Asset 1 URI will become: https://example.com/id/1
   */
  uriBase: string;

  /**
   * Hashed representation of JSON schema defining this object.
   */
  schemaId: string;

  /**
   * Array representing capabilities.
   */
  capabilities?: AssetLedgerCapability[];

  /**
   * Id (address) of the owner of this asset ledger.
   */
  owner: string;
}

/**
 * Token transfer data definition.
 */
export interface TokenTransferData {

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the receiver.
   */
  receiverId?: string;

  /**
   * The amount of value(erc20 tokens).
   */
  value: string; // TODO BN.js

}
