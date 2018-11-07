import { Model, prop } from '@rawmodel/core';
import { OrderActionKind } from './types';

/**
 * 
 */
export interface TransferAssetOrderActionBase {
  kind: OrderActionKind.TRANSFER_ASSET;
  ledgerId: string;
  senderId: string;
  receiverId: string;
  assetId: string;
}

/**
 * 
 */
export class TransferAssetOrderAction extends Model implements TransferAssetOrderActionBase {

  /**
   * 
   */
  @prop({
    cast: { handler: 'Integer' },
    get: () => OrderActionKind.TRANSFER_ASSET,
  })
  public kind: OrderActionKind.TRANSFER_ASSET;

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
  })
  public ledgerId: string;

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
  })
  public senderId: string;

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
  })
  public receiverId: string;

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
  })
  public assetId: string;

}