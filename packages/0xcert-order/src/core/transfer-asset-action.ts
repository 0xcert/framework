import { Model, prop } from '@rawmodel/core';
import { ActionKind } from './types';

/**
 * 
 */
export class TransferAssetAction extends Model {

  /**
   * 
   */
  @prop({
    cast: { handler: 'Integer' },
    get: () => ActionKind.TRANSFER_ASSET,
  })
  public kind: ActionKind.TRANSFER_ASSET;

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
    cast: { handler: 'Integer' },
  })
  public value: number;

}