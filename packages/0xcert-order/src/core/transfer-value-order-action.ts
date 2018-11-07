import { Model, prop } from '@rawmodel/core';
import { OrderActionKind } from './types';

/**
 * 
 */
export interface TransferValueOrderActionBase {
  kind: OrderActionKind.TRANSFER_VALUE;
  ledgerId: string;
  senderId: string;
  receiverId: string;
  value: number;
}

/**
 * 
 */
export class TransferValueOrderAction extends Model implements TransferValueOrderActionBase {

  /**
   * 
   */
  @prop({
    cast: { handler: 'Integer' },
    get: () => OrderActionKind.TRANSFER_VALUE,
  })
  public kind: OrderActionKind.TRANSFER_VALUE;

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