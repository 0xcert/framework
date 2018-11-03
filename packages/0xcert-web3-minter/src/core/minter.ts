import { MinterBase } from '@0xcert/scaffold';
import { Connector } from '@0xcert/web3-connector';
import { tuple } from '@0xcert/web3-utils';
import * as env from '../config/env';
import { MinterOrder } from './order';

/**
 * 
 */
export class Minter implements MinterBase {
  readonly connector: Connector;
  readonly contract: any;

  /**
   * 
   */
  public constructor(connector: Connector) {
    this.connector = connector;
    this.contract = new connector.web3.eth.Contract(env.minterAbi, connector.minterId, { gas: 6000000 });
  }

  /**
   * 
   */
  public async perform(order: MinterOrder) {
    const xcertData = {
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
    
    const mintData = {
      from: order.recipe.makerId,
      to: order.recipe.takerId,
      xcertData,
      transfers,
      seed: order.recipe.seed,
      expirationTimestamp: order.recipe.expiration,
    };
    const mintTuple = tuple(mintData);
  
    const [kind, signature] = (order.signature || '').split(':');
    const signatureTuple = tuple({
      r: signature.substr(0, 66),
      s: `0x${signature.substr(66, 64)}`,
      v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
      kind
    });

    const from = this.connector.makerId;
    return this.connector.mutate(() => {
      return this.contract.methods.performMint(mintTuple, signatureTuple).send({ from });
    });
  }

}
