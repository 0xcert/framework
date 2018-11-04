import { MinterBase } from '@0xcert/scaffold';
import { Context } from '@0xcert/web3-context';
import { tuple } from '@0xcert/web3-utils';
import * as env from '../config/env';
import { MinterOrder } from './order';

/**
 * 
 */
export class Minter implements MinterBase {
  readonly platform: string = 'web3';
  readonly context: Context;
  readonly contract: any;

  /**
   * 
   */
  public constructor(context: Context) {
    this.context = context;
    this.contract = new context.web3.eth.Contract(env.minterAbi, context.minterId, { gas: 6000000 });
  }

  /**
   * 
   */
  public async perform(order: MinterOrder) {
    const recipeTuple = this.createRecipeTuple(order);
    const signatureTuple = this.createSignatureTuple(order);
    const from = this.context.makerId;

    return this.context.mutate(() => {
      return this.contract.methods.performMint(recipeTuple, signatureTuple).send({ from });
    });
  }

  /**
   * 
   */
  public async cancel(order: MinterOrder) {
    const recipeTuple = this.createRecipeTuple(order);
    const from = this.context.makerId;

    return this.context.mutate(() => {
      return this.contract.methods.cancelMint(recipeTuple).send({ from });
    });
  }

  /**
   * 
   */
  protected createRecipeTuple(order: MinterOrder) {
    const assetData = {
      xcert: order.recipe.asset.folderId,
      id: order.recipe.asset.assetId,
      proof: order.recipe.asset.proof,
    };

    const transfers = order.recipe.transfers.map((transfer) => {
      return {
        token: transfer['folderId'] || transfer['vaultId'],
        proxy: transfer['assetId'] ? 1 : 0,
        from: transfer['senderId'],
        to: transfer['receiverId'],
        value: transfer['assetId'] || transfer['amount'],
      };
    });
    
    const recipeData = {
      from: order.recipe.makerId,
      to: order.recipe.takerId,
      assetData,
      transfers,
      seed: order.recipe.seed,
      expirationTimestamp: order.recipe.expiration,
    };
    
    return tuple(recipeData);
  }

  /**
   * 
   */
  protected createSignatureTuple(order: MinterOrder) {
    const [kind, signature] = (order.signature || '').split(':');
    
    const signatureData = {
      r: signature.substr(0, 66),
      s: `0x${signature.substr(66, 64)}`,
      v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
      kind
    };

    return tuple(signatureData);
  }

}
