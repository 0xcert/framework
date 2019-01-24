import { MutationBase } from './mutation';

/**
 * List of available order action kinds.
 */
export enum OrderActionKind {
  CREATE_ASSET = 1,
  TRANSFER_ASSET = 2,
  TRANSFER_VALUE = 3,
}

/**
 * Order gateway method definition.
 */
export interface OrderGatewayBase {
  readonly id: string;
  claim(order: Order): Promise<string>;
  perform(order: Order, claim: string): Promise<MutationBase>;
  cancel(order: Order): Promise<MutationBase>;
}

/**
 *
 */
export type OrderAction = OrderActionCreateAsset | OrderActionTransferAsset
  | OrderActionTransferValue;

/**
 * Order create asset data definitio.
 */
export interface OrderActionCreateAsset {
  kind: OrderActionKind.CREATE_ASSET;
  ledgerId: string;
  senderId: string;
  receiverId: string;
  assetId: string;
  assetImprint: string;
}

/**
 * Order transfer asset data definition.
 */
export interface OrderActionTransferAsset {
  kind: OrderActionKind.TRANSFER_ASSET;
  ledgerId: string;
  senderId: string;
  receiverId: string;
  assetId: string;
}

/**
 * Order transfer value data definition.
 */
export interface OrderActionTransferValue {
  kind: OrderActionKind.TRANSFER_VALUE;
  ledgerId: string;
  senderId: string;
  receiverId: string;
  value: string; // TODO BN.js
}

/**
 * Order definition.
 */
export class Order {
  public makerId: string;
  public takerId: string;
  public actions: OrderAction[];
  public seed: number;
  public expiration: number;
}
