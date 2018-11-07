import { CreateAssetOrderActionBase } from "./create-asset-order-action";
import { TransferAssetOrderActionBase } from "./transfer-asset-order-action";
import { TransferValueOrderActionBase } from "./transfer-value-order-action";

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
export type OrderAction = CreateAssetOrderActionBase | TransferAssetOrderActionBase
| TransferValueOrderActionBase;
