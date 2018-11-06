import { OrderExchangeBase } from '@0xcert/scaffold';
import { Context } from '@0xcert/web3-context';
import { Order } from '@0xcert/web3-order';
import { tuple } from '@0xcert/web3-utils';
import * as env from '../config/env';

/**
 * 
 */
export class OrderExchange implements OrderExchangeBase {
  readonly platform: string = 'web3';
  readonly context: Context;
  readonly contract: any;

  /**
   * 
   */
  public constructor(context: Context) {
    this.context = context;
    this.contract = new context.web3.eth.Contract(env.exchangeAbi, context.exchangeId, { gas: 6000000 });
  }

  /**
   * 
   */
  public async perform(order: Order) {
    const recipeTuple = this.createRecipeTuple(order);
    const signatureTuple = this.createSignatureTuple(order);
    const from = this.context.makerId;

    return this.context.mutate(() => {
      return this.contract.methods.performSwap(recipeTuple, signatureTuple).send({ from });
    });
  }

  /**
   * 
   */
  public async cancel(order: Order) {
    const recipeTuple = this.createRecipeTuple(order);
    const from = this.context.makerId;

    return this.context.mutate(() => {
      return this.contract.methods.cancelSwap(recipeTuple).send({ from });
    });
  }

  /**
   * 
   */
  protected createRecipeTuple(order: Order) {
    const transfers = order.actions.map((action) => {
      return {
        token: action['ledgerId'],
        proxy: action['assetId'] ? 1 : 0,
        // from: action['senderId'],
        // to: action['receiverId'],
        // value: action['assetId'] || action['value'],
      };
    });
    
    const recipeData = {
      from: order.makerId,
      to: order.takerId,
      transfers,
      seed: order.seed,
      expirationTimestamp: order.expiration,
    };
    
    return tuple(recipeData);
  }

  /**
   * 
   */
  protected createSignatureTuple(order: Order) {
    const [kind, signature] = (order.signature || '').split(':');
    
    const signatureData = {
      r: signature.substr(0, 66),
      s: `0x${signature.substr(66, 64)}`,
      v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
      kind,
    };

    return tuple(signatureData);
  }

}
