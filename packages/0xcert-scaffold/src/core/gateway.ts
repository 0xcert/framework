import { AssetLedgerAbility, AssetLedgerCapability } from './asset-ledger';
import { MutationBase } from './mutation';

/**
 * List of available order action kinds.
 */
export enum ActionsOrderActionKind {
  CREATE_ASSET = 1,
  TRANSFER_ASSET = 2,
  TRANSFER_VALUE = 3,
  UPDATE_ASSET_IMPRINT = 4,
  SET_ABILITIES = 5,
}

/**
 * Order gateway method definition.
 */
export interface GatewayBase {

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
export type ActionsOrderAction = ActionsOrderActionCreateAsset | ActionsOrderActionTransferAsset
  | ActionsOrderActionTransferValue | ActionsOrderActionUpdateAssetImprint | ActionsOrderActionSetAbilities;

/**
 * Order create asset data definitio.
 */
export interface ActionsOrderActionSetAbilities {

  /**
   * Type od order action.
   */
  kind: ActionsOrderActionKind.SET_ABILITIES;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of account we are setting abilitites to.
   */
  receiverId?: string;

  /**
   * Abilities we want to set.
   */
  abilities: AssetLedgerAbility[];
}

/**
 * Order create asset data definitio.
 */
export interface ActionsOrderActionCreateAsset {

  /**
   * Type od order action.
   */
  kind: ActionsOrderActionKind.CREATE_ASSET;

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
export interface ActionsOrderActionTransferAsset {

  /**
   * Type od order action.
   */
  kind: ActionsOrderActionKind.TRANSFER_ASSET;

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
export interface ActionsOrderActionUpdateAssetImprint {

  /**
   * Type od order action.
   */
  kind: ActionsOrderActionKind.UPDATE_ASSET_IMPRINT;

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
export interface ActionsOrderActionTransferValue {

  /**
   * Type od order action.
   */
  kind: ActionsOrderActionKind.TRANSFER_VALUE;

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
export type Order = ActionsOrder | AssetLedgerDeployOrder | ValueLedgerDeployOrder;

/**
 * List of available order kinds.
 */
export enum OrderKind {
  ACTIONS_ORDER = 1,
  ASSET_LEDGER_DEPLOY_ORDER = 2,
  VALUE_LEDGER_DEPLOY_ORDER = 3,
}

/**
 * Order definition.
 */
export class ActionsOrder {

  /**
   * Type of order.
   */
  public kind: OrderKind.ACTIONS_ORDER;

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
  public actions: ActionsOrderAction[];

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
 * Asset ledger deploy definition.
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
 * Asset ledger deploy definition.
 */
export class ValueLedgerDeployOrder {

  /**
   * Type of order.
   */
  public kind: OrderKind.VALUE_LEDGER_DEPLOY_ORDER;

  /**
   * Address of the order maker.
   */
  public makerId: string;

  /**
   * Address of the order taker.
   */
  public takerId?: string;

  /**
   * Data from which a new value ledger will be created.
   */
  public valueLedgerData: ValueLedgerData;

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

  /**
   * Id (address) of the owner of this asset ledger.
   */
  owner: string;
}

/**
 * Value ledger deploy data definition.
 */
export interface ValueLedgerData {

  /**
   * Value Ledger name.
   */
  name: string;

  /**
   * Value Ledger symbol/ticker.
   */
  symbol: string;

  /**
   * Value ledger supply
   */
  supply: string;

  /**
   * Value ledger number of decimals.
   */
  decimals: string;

  /**
   * Id (address) of the owner of this value ledger (will own the whole supply at deploy).
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
