import { OrderExchangeBase, ConnectorError } from '@0xcert/scaffold';
import { Context } from '@0xcert/web3-context';
import { Order, OrderActionKind, OrderAction } from '@0xcert/order';
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
    const hash = this.createOrderHash(order);

    console.log('CLAIM1', hash);
    console.log('CLAIM2',
      await this.contract.methods.getOrderDataClaim(
        this.createRecipeTuple(order)
      ).call()
    );

    return await this.context.sign(hash);
  }

  /**
   * 
   */
  public async perform(order: Order, claim: string) {
    const recipeTuple = this.createRecipeTuple(order);
    const signatureTuple = this.createSignatureTuple(claim);
    const from = this.context.myId;

    try {
      const gas = await this.contract.methods.perform(recipeTuple, signatureTuple).estimateGas({ from });
      if (gas > 6000000) {
        throw new ConnectorError(0);
      }
    } 
    catch (error) {
      console.log('ERRORR!!!!!!!', error);
      throw new ConnectorError(0);
    }

    // const resolver = () => {
    //   return this.contract.methods.perform(recipeTuple, signatureTuple).send({ from, gas });
    // };
    // await new Promise((resolve, reject) => {
    //   try {
    //     const obj = resolver();
    //     obj.once('receipt', (tx) => resolve(tx.transactionId));
    //     obj.once('error', () => reject('ERROR2'));
    //   }
    //   catch (error) {
    //     reject('ERROR');
    //   }
    // // }).catch(() => {
    // //   console.log('ERROR');
    // }).catch(() => {
    //   console.log('ERROR!!!!!!!')
    // });

    return this.context.mutate(() => {
      return this.contract.methods.perform(recipeTuple, signatureTuple).send({ from });
    });
  }

  /**
   * 
   */
  public async cancel(order: Order) {
    const recipeTuple = this.createRecipeTuple(order);
    const from = this.context.myId;

    return this.context.mutate(() => {
      return this.contract.methods.cancel(recipeTuple).send({ from });
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
        token: action.ledgerId,
        param1: this.getHashParam1(action),
        to: action.receiverId,
        value: this.getHashValue(action),
      };
    });

    const recipeData = {
      from: order.makerId,
      to: order.takerId,
      actions,
      seed: order.seed,
      expirationTimestamp: order.expiration,
    };

    console.log(recipeData);

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
        { t: 'uint256', v: this.getHashKind(action) },
        this.getHashProxy(action),
        action.ledgerId,
        this.getHashParam1(action),
        action.receiverId,
        this.getHashValue(action),
      );
    }

    console.log(
      this.context.exchangeId,
      order.makerId,
      order.takerId,
      temp,
      order.seed,
      order.expiration
    );

    return this.context.web3.utils.soliditySha3(
      this.context.exchangeId,
      order.makerId,
      order.takerId,
      temp,
      order.seed,
      order.expiration
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
      : this.context.web3.utils.padLeft(action.senderId, 64);
  }

  /**
   * 
   */
  protected getHashValue(action: OrderAction) {
    return action['assetId'] || action['value'];
  }

}
