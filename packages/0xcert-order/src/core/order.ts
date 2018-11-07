import { Model, prop } from '@rawmodel/core';
import { ActionKind } from './types';
import { CreateAssetAction } from './create-asset-action';
import { TransferAssetAction } from './transfer-asset-action';
import { TransferValueAction } from './transfer-value-action';

/**
 * 
 */
export type Action = CreateAssetAction | TransferAssetAction | TransferValueAction;

/**
 * 
 */
function castToAction(obj) {
  if (obj && obj.kind === ActionKind.CREATE_ASSET) {
    return new CreateAssetAction(obj);
  }
  else if (obj && obj.kind === ActionKind.TRANSFER_ASSET) {
    return new TransferAssetAction(obj);
  }
  else if (obj && obj.kind === ActionKind.TRANSFER_VALUE) {
    return new TransferValueAction(obj);
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
  public ledgerId: string;

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
    cast: { handler: castToAction },
    emptyValue: [],
  })
  public actions: Action[];

  /**
   * 
   */
  @prop({
    cast: { handler: 'Integer' },
  })
  public seed: number;

  /**
   * 
   */
  @prop({
    cast: { handler: 'Integer' },
  })
  public expiration: number;

}
