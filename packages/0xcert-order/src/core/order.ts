import { Model, prop } from '@rawmodel/core';
import { OrderActionKind, OrderAction } from './types';
import { CreateAssetOrderAction } from './create-asset-order-action';
import { TransferAssetOrderAction } from './transfer-asset-order-action';
import { TransferValueOrderAction } from './transfer-value-order-action';

/**
 * 
 */
function castToOrderAction(obj): OrderAction {
  if (obj && obj.kind === OrderActionKind.CREATE_ASSET) {
    return new CreateAssetOrderAction(obj);
  }
  else if (obj && obj.kind === OrderActionKind.TRANSFER_ASSET) {
    return new TransferAssetOrderAction(obj);
  }
  else if (obj && obj.kind === OrderActionKind.TRANSFER_VALUE) {
    return new TransferValueOrderAction(obj);
  }
  else {
    return null;
  }
}

/**
 * 
 */
export class Order extends Model {

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
  })
  public id: string;

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
  })
  public makerId: string;

  /**
   * 
   */
  @prop({
    cast: { handler: 'String' },
  })
  public takerId: string;

  /**
   * 
   */
  @prop({
    cast: { handler: castToOrderAction, array: true },
    emptyValue: [],
  })
  public actions: OrderAction[];

  /**
   * 
   */
  @prop({
    cast: { handler: 'Integer' },
    defaultValue: () => Date.now(),
  })
  public seed: number;

  /**
   * 
   */
  @prop({
    cast: { handler: 'Integer' },
    defaultValue: () => Date.now() * 60 * 60 * 24, // 1h
  })
  public expiration: number;

}
