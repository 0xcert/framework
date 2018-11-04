import { VaultBase } from '@0xcert/scaffold';
import { Context } from '@0xcert/web3-context';
import getInfo from '../queries/get-info';
import getSupply from '../queries/get-supply';
import * as env from '../config/env';

/**
 * 
 */
export class Vault implements VaultBase {
  readonly platform: string = 'web3';
  readonly context: Context;
  readonly contract: any;

  /**
   * 
   */
  public constructor(context: Context, vaultId?: string) {
    this.context = context;
    this.contract = this.getVault(vaultId);
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
  protected getVault(vaultId: string) {
    return new this.context.web3.eth.Contract(env.tokenAbi, vaultId, { gas: 6000000 });
  }

}
