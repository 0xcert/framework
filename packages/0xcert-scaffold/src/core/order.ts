import { ContextBase } from "./context";

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
export interface OrderBase extends OrderOutput {
  readonly platform: string;
  readonly context: ContextBase;
  makerId: string;
  takerId: string;
  actions: OrderAction[];
  seed: number;
  expiration: number;
  signature: string;
  populate(data: OrderInput): this;
  serialize(): OrderOutput;
  sign(): Promise<this>;
}

/**
 * 
 */
export type OrderAction = OrderActionCreateAsset | OrderActionTransferAsset | OrderActionTransferValue;

/**
 * 
 */
export interface OrderActionCreateAsset {
  kind: OrderActionKind.CREATE_ASSET;
  ledgerId: string;
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
  value: number;
}

/**
 * 
 */
export interface OrderInput {
  makerId?: string;
  takerId?: string;
  actions?: OrderAction[];
  seed?: number;
  expiration?: number;
  signature?: string;
}

/**
 * 
 */
export interface OrderOutput {
  makerId: string;
  takerId: string;
  actions: OrderAction[];
  seed: number;
  expiration: number;
  signature: string;
}
