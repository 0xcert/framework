import { OrderExchangeBase } from '@0xcert/scaffold';
import { Context } from '@0xcert/web3-context';
import { Order } from '@0xcert/order';
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
  public async claim(order) {
    return await this.context.sign(
      this.createOrderHash(order)
    );
  }

  /**
   * 
   */
  public async perform(order: Order, claim: string) {
    const recipeTuple = this.createRecipeTuple(order);
    const signatureTuple = this.createSignatureTuple(claim);
    const from = this.context.myId;

    return this.context.mutate(() => {
      return this.contract.methods.performSwap(recipeTuple, signatureTuple).send({ from });
    });
  }

  /**
   * 
   */
  public async cancel(order: Order) {
    const recipeTuple = this.createRecipeTuple(order);
    const from = this.context.myId;

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
        from: action['senderId'],
        to: action['receiverId'],
        value: action['assetId'] || action['value'],
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
  protected createSignatureTuple(claim: string) {
    const [kind, signature] = claim.split(':');
    
    const signatureData = {
      r: signature.substr(0, 66),
      s: `0x${signature.substr(66, 64)}`,
      v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
      kind,
    };

    return tuple(signatureData);
  }

  /**
   * 
   */
  protected createOrderHash(order: Order) {
    let temp = '0x0';
    for(const action of order.actions) {
      temp = this.context.web3.utils.soliditySha3(
        { t: 'bytes32', v: temp },
        action['kind'],
        action['ledgerId'],
        action['assetId'] ? 1 : 0,
        action.senderId,
        action.receiverId,
        action['assetId'] || action['value'],
      );
    } 
    return this.context.web3.utils.soliditySha3(
      this.context.exchangeId,
      order.makerId,
      order.takerId,
      temp,
      order.seed || Date.now(), // seed
      order.expiration // expires
    );
  }

}
