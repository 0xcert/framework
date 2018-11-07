import { Model, prop } from '@rawmodel/core';
import { ActionKind } from './types';

/**
 * 
 */
export class CreateAssetAction extends Model {

  /**
   * 
   */
  @prop({
    cast: { handler: 'Integer' },
    get: () => ActionKind.CREATE_ASSET,
  })
  public kind: ActionKind.CREATE_ASSET;

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