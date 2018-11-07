import { Model, prop } from '@rawmodel/core';
import { OrderActionKind } from './types';

/**
 * 
 */
export interface CreateAssetOrderActionBase {
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
export class CreateAssetOrderAction extends Model implements CreateAssetOrderActionBase {

  /**
   * 
   */
  @prop({
    cast: { handler: 'Integer' },
    get: () => OrderActionKind.CREATE_ASSET,
  })
  public kind: OrderActionKind.CREATE_ASSET;

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

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
  })
  public assetProof: string;

}