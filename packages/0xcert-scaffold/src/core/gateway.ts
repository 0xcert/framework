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
  DESTROY_ASSET = 6,
}

/**
 * Order gateway method definition.
 */
export interface GatewayBase {

  /**
   * Gets signed claim for an order.
   * @param order Order data.
   */
  sign(order: Order): Promise<string>;

  /**
   * Generates hash of an order.
   * @param order Order data.
   */
  hash(order: Order): Promise<string>;

  /**
   * Performs an order.
   * @param order Order data.
   * @param claim Claim data.
   */
  perform(order: Order, claim: string | string[]): Promise<MutationBase>;

  /**
   * Cancels an order.
   * @param order Order data.
   */
  cancel(order: Order): Promise<MutationBase>;
}

/**
 * Different order actions.
 */
export type ActionsOrderAction = DynamicActionsOrderAction | FixedActionsOrderAction;

/**
 * Different dynamic order actions.
 */
export type DynamicActionsOrderAction = DynamicActionsOrderActionCreateAsset | DynamicActionsOrderActionTransferAsset
| DynamicActionsOrderActionTransferValue | DynamicActionsOrderActionUpdateAssetImprint | DynamicActionsOrderActionSetAbilities
| DynamicActionsOrderActionDestroyAsset;

/**
 * Order create asset data definition.
 */
export interface DynamicActionsOrderActionSetAbilities {

  /**
   * Type od order action.
   */
  kind: ActionsOrderActionKind.SET_ABILITIES;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender - setter of abilitites.
   */
  senderId?: string;

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
 * Order create asset data definition.
 */
export interface DynamicActionsOrderActionCreateAsset {

  /**
   * Type od order action.
   */
  kind: ActionsOrderActionKind.CREATE_ASSET;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender - creator.
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

  /**
   * Merkle tree root of asset proof.
   */
  assetImprint: string;
}

/**
 * Order destory asset data definition.
 */
export interface DynamicActionsOrderActionDestroyAsset {

  /**
   * Type od order action.
   */
  kind: ActionsOrderActionKind.DESTROY_ASSET;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender - destroyer.
   */
  senderId?: string;

  /**
   * Unique asset Id.
   */
  assetId: string;
}

/**
 * Order transfer asset data definition.
 */
export interface DynamicActionsOrderActionTransferAsset {

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
export interface DynamicActionsOrderActionUpdateAssetImprint {

  /**
   * Type od order action.
   */
  kind: ActionsOrderActionKind.UPDATE_ASSET_IMPRINT;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender - updator.
   */
  senderId?: string;

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
export interface DynamicActionsOrderActionTransferValue {

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
 * Different fixed order actions.
 */
export type FixedActionsOrderAction = FixedActionsOrderActionCreateAsset | FixedActionsOrderActionTransferAsset
| FixedActionsOrderActionTransferValue | FixedActionsOrderActionUpdateAssetImprint | FixedActionsOrderActionSetAbilities
| FixedActionsOrderActionDestroyAsset;

/**
 * Order create asset data definitio.
 */
export interface FixedActionsOrderActionSetAbilities {

  /**
   * Type od order action.
   */
  kind: ActionsOrderActionKind.SET_ABILITIES;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender - setter of abilitites.
   */
  senderId: string;

  /**
   * Id (address) of account we are setting abilitites to.
   */
  receiverId: string;

  /**
   * Abilities we want to set.
   */
  abilities: AssetLedgerAbility[];
}

/**
 * Order create asset data definitio.
 */
export interface FixedActionsOrderActionCreateAsset {

  /**
   * Type od order action.
   */
  kind: ActionsOrderActionKind.CREATE_ASSET;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender - creator.
   */
  senderId: string;

  /**
   * Id (address) of the receiver.
   */
  receiverId: string;

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
 * Order destory asset data definitio.
 */
export interface FixedActionsOrderActionDestroyAsset {

  /**
   * Type of order action.
   */
  kind: ActionsOrderActionKind.DESTROY_ASSET;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender - destroyer.
   */
  senderId: string;

  /**
   * Unique asset Id.
   */
  assetId: string;
}

/**
 * Order transfer asset data definition.
 */
export interface FixedActionsOrderActionTransferAsset {

  /**
   * Type of order action.
   */
  kind: ActionsOrderActionKind.TRANSFER_ASSET;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender.
   */
  senderId: string;

  /**
   * Id (address) of the receiver.
   */
  receiverId: string;

  /**
   * Unique asset Id.
   */
  assetId: string;
}

/**
 * Order transfer asset data definition.
 */
export interface FixedActionsOrderActionUpdateAssetImprint {

  /**
   * Type of order action.
   */
  kind: ActionsOrderActionKind.UPDATE_ASSET_IMPRINT;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender - updator.
   */
  senderId: string;

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
export interface FixedActionsOrderActionTransferValue {

  /**
   * Type of order action.
   */
  kind: ActionsOrderActionKind.TRANSFER_VALUE;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the sender.
   */
  senderId: string;

  /**
   * Id (address) of the receiver.
   */
  receiverId: string;

  /**
   * The amount of value(erc20 tokens).
   */
  value: string; // TODO BN.js
}

export type ActionsOrder = FixedActionsOrder | SignedFixedActionsOrder |
SignedDynamicActionsOrder | DynamicActionsOrder;

/**
 * Different order actions.
 */
export type Order = AssetLedgerDeployOrder | ValueLedgerDeployOrder | ActionsOrder | AssetSetOperatorOrder | DappValueApproveOrder;

/**
 * List of available order kinds.
 */
export enum OrderKind {
  ASSET_LEDGER_DEPLOY_ORDER = 1,
  VALUE_LEDGER_DEPLOY_ORDER = 2,
  FIXED_ACTIONS_ORDER = 3,
  DYNAMIC_ACTIONS_ORDER = 4,
  SIGNED_FIXED_ACTIONS_ORDER = 5,
  SIGNED_DYNAMIC_ACTIONS_ORDER = 6,
  ASSET_SET_OPERATOR_ORDER = 7,
  DAPP_VALUE_APPROVE_ORDER = 8,
}

/**
 * DappValueApproveOrder definition.
 */
export class DappValueApproveOrder {

  /**
   * Type of order.
   */
  public kind: OrderKind.DAPP_VALUE_APPROVE_ORDER;

  /**
   * Id (address) of the smart contract that represents the dapp token value ledger.
   */
  public ledgerId: string;

  /**
   * Address that is approving value.
   */
  public approver: string;

  /**
   * Address what will get approved.
   */
  public spender: string;

  /**
   * Amount for which approver is approving spender.
   */
  public value: string;

  /**
   * Recipient of the fee for performing this order.
   */
  public feeRecipient?: string;

  /**
   * Amount of fee recipient will receive.
   */
  public feeValue: string;

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
 * AssetSetOperatorOrder definition.
 */
export class AssetSetOperatorOrder {

  /**
   * Type of order.
   */
  public kind: OrderKind.ASSET_SET_OPERATOR_ORDER;

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  public ledgerId: string;

  /**
   * Address of asset owner.
   */
  public owner: string;

  /**
   * Address which we are setting operator status.
   */
  public operator: string;

  /**
   * Operator status.
   */
  public isOperator: boolean;

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
 * Order definition.
 */
export class DynamicActionsOrder {

  /**
   * Type of order.
   */
  public kind: OrderKind.DYNAMIC_ACTIONS_ORDER;

  /**
   * Array of order signers.
   */
  public signers: string[];

  /**
   * Array of actions that will execute in this order.
   */
  public actions: DynamicActionsOrderAction[];

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
 * Order definition.
 */
export class SignedDynamicActionsOrder {

  /**
   * Type of order.
   */
  public kind: OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER;

  /**
   * Array of order signers.
   */
  public signers: string[];

  /**
   * Array of actions that will execute in this order.
   */
  public actions: DynamicActionsOrderAction[];

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
 * Order definition.
 */
export class FixedActionsOrder {

  /**
   * Type of order.
   */
  public kind: OrderKind.FIXED_ACTIONS_ORDER;

  /**
   * Array of order signers.
   */
  public signers: string[];

  /**
   * Array of actions that will execute in this order.
   */
  public actions: FixedActionsOrderAction[];

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
 * Order definition.
 */
export class SignedFixedActionsOrder {

  /**
   * Type of order.
   */
  public kind: OrderKind.SIGNED_FIXED_ACTIONS_ORDER;

  /**
   * Array of order signers.
   */
  public signers: string[];

  /**
   * Array of actions that will execute in this order.
   */
  public actions: FixedActionsOrderAction[];

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
  ownerId: string;
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
  ownerId: string;
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
