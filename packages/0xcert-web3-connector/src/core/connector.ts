import { ConnectorBase, Mutation } from "@0xcert/scaffold";
import { Context, ContextOptions } from '@0xcert/web3-context';
import { AssetLedger } from '@0xcert/web3-asset-ledger';
import { ValueLedger } from '@0xcert/web3-value-ledger';
import { OrderExchange } from '@0xcert/web3-order-exchange';

/**
 * 
 */
export interface ConnectorConfig extends ContextOptions {}

/**
 * 
 */
export class Connector implements ConnectorBase {
  protected context: Context;

  /**
   * 
   */
  public constructor(options?: ConnectorConfig) {
    this.context = new Context(options);
  }

  /**
   * 
   */
  public async sign(val: string) {
    return this.context.sign(val);
  }

  /**
   * 
   */
  public async getMutation(id: string): Promise<Mutation> {
    const receipt = await this.context.web3.eth.getTransaction(id);
    if (!receipt) {
      return null;
    }

    const currentBlock = await this.context.web3.eth.getBlockNumber();
    return {
      id,
      confirmations: currentBlock - receipt.blockNumber,
    };  
  }

  /**
   * 
   */
  public async getAssetLedger(id: string) {
    return new AssetLedger(this.context, id);
  }

  /**
   * 
   */
  public async getValueLedger(id: string) {
    return new ValueLedger(this.context, id);
  }

  /**
   * 
   */
  public async getOrderExchange(id: string = null) {
    return new OrderExchange(this.context, id);
  }

}
