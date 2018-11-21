import { ValueLedgerBase } from '@0xcert/scaffold';
import { Context } from '@0xcert/web3-context';
import getInfo from '../queries/get-info';
import getSupply from '../queries/get-supply';
import * as env from '../config/env';

/**
 * 
 */
export class ValueLedger implements ValueLedgerBase {
  readonly context: Context;
  readonly contract: any;

  /**
   * 
   */
  public constructor(context: Context, id?: string) {
    this.context = context;
    this.contract = this.getContract(id);
  }

  /**
   * 
   */
  public get id() {
    return this.contract.options.address;
  }

  /**
   * 
   */
  public async getInfo() {
    return getInfo(this);
  }

  /**
   * 
   */
  public async getSupply() {
    return getSupply(this);
  }

  /**
   * 
   */
  protected getContract(id: string) {
    return new this.context.web3.eth.Contract(env.tokenAbi, id, { gas: 6000000 });
  }

}
