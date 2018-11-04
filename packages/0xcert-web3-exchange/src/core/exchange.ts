import { ExchangeBase } from '@0xcert/scaffold';
import { Context } from '@0xcert/web3-context';
import { tuple } from '@0xcert/web3-utils';
import { ExchangeOrder } from './order';
import * as env from '../config/env';

/**
 * 
 */
export class Exchange implements ExchangeBase {
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
  public async perform(order: ExchangeOrder) {
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
  public async cancel(order: ExchangeOrder) {
    const recipeTuple = this.createRecipeTuple(order);
    const from = this.context.makerId;

    return this.context.mutate(() => {
      return this.contract.methods.cancelSwap(recipeTuple).send({ from });
    });
  }

  /**
   * 
   */
  protected createRecipeTuple(order: ExchangeOrder) {
    const transfers = order.recipe.transfers.map((transfer) => {
      return {
        token: transfer['ledgerId'],
        proxy: transfer['assetId'] ? 1 : 0,
        from: transfer['senderId'],
        to: transfer['receiverId'],
        value: transfer['assetId'] || transfer['amount'],
      };
    });
    
    const recipeData = {
      from: order.recipe.makerId,
      to: order.recipe.takerId,
      transfers,
      seed: order.recipe.seed,
      expirationTimestamp: order.recipe.expiration,
    };
    
    return tuple(recipeData);
  }

  /**
   * 
   */
  protected createSignatureTuple(order: ExchangeOrder) {
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
