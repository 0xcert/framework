import { OrderExchangeBase, Order, OrderActionKind, OrderAction } from '@0xcert/scaffold';
import { Context } from '@0xcert/web3-context';
import { tuple, toFloat, toInteger, toSeconds, toString } from '@0xcert/web3-utils';
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
    const hash = this.createOrderHash(order);

    return await this.context.sign(hash);
  }

  /**
   * 
   */
  public async perform(order: Order, claim: string) {
    const recipeTuple = this.createRecipeTuple(order);
    const signatureTuple = this.createSignatureTuple(claim);

    return this.context.mutate(async () => {
      return this.contract.methods.perform(recipeTuple, signatureTuple);
    });
  }

  /**
   * 
   */
  public async cancel(order: Order) {
    const recipeTuple = this.createRecipeTuple(order);
    const from = this.context.myId;

    return this.context.mutate(async () => {
      return this.contract.methods.cancel(recipeTuple);
    });
  }

  /**
   * 
   */
  protected createRecipeTuple(order: Order) {

    const actions = order.actions.map((action) => {
      return {
        kind: this.getHashKind(action),
        proxy: this.getHashProxy(action),
        token: toString(action.ledgerId),
        param1: this.getHashParam1(action),
        to: toString(action.receiverId),
        value: this.getHashValue(action),
      };
    });

    const recipeData = {
      from: toString(order.makerId),
      to: toString(order.takerId),
      actions,
      seed: toInteger(order.seed),
      expirationTimestamp: toSeconds(order.expiration),
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
        { t: 'uint8', v: this.getHashKind(action) },
        { t: 'uint32', v: this.getHashProxy(action) },
        toString(action.ledgerId),
        this.getHashParam1(action),
        toString(action.receiverId),
        this.getHashValue(action),
      );
    }

    return this.context.web3.utils.soliditySha3(
      this.context.exchangeId,
      toString(order.makerId),
      toString(order.takerId),
      temp,
      toInteger(order.seed),
      toSeconds(order.expiration)
    );
  }

  /**
   * 
   */
  protected getHashKind(action: OrderAction) {
    return action.kind === OrderActionKind.CREATE_ASSET ? 0 : 1;
  }

  /**
   * 
   */
  protected getHashProxy(action: OrderAction) {
    if (action.kind === OrderActionKind.TRANSFER_VALUE) {
      return 1;
    }
    else if (action.kind === OrderActionKind.TRANSFER_ASSET) {
      return 3; // TODO if safeTransfer not supported set to 2
    }
    else {
      return 0;
    }
  }

  /**
   * 
   */
  protected getHashParam1(action: OrderAction) {
    return action.kind === OrderActionKind.CREATE_ASSET
      ? action['assetProof']
      : this.context.web3.utils.padLeft(toString(action.senderId), 64);
  }

  /**
   * 
   */
  protected getHashValue(action: OrderAction) {
    return action['assetId'] || toFloat(action['value']);
  }

}
