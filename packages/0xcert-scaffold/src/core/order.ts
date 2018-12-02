/**
 * 
 */
export enum OrderActionKind {
  CREATE_ASSET = 1,
  TRANSFER_ASSET = 2,
  TRANSFER_VALUE = 3,
}

/**
 * 
 */
export type OrderAction = OrderActionCreateAsset | OrderActionTransferAsset
  | OrderActionTransferValue;

/**
 * 
 */
export interface OrderActionCreateAsset {
  kind: OrderActionKind.CREATE_ASSET;
  ledgerId: string;
  senderId: string;
  receiverId: string;
  assetId: string;
  assetProof: string;
}

/**
 * 
 */
export interface OrderActionTransferAsset {
  kind: OrderActionKind.TRANSFER_ASSET;
  ledgerId: string;
  senderId: string;
  receiverId: string;
  assetId: string;
}

/**
 * 
 */
export interface OrderActionTransferValue {
  kind: OrderActionKind.TRANSFER_VALUE;
  ledgerId: string;
  senderId: string;
  receiverId: string;
  value: string; // TODO BN.js
}

/**
 * 
 */
export class Order {
  public makerId: string;
  public takerId: string;
  public actions: OrderAction[];
  public seed: number;
  public expiration: number;
}
