import { VaultBase } from '@0xcert/scaffold';
import { Connector } from '@0xcert/web3-connector';
import getInfo from '../queries/get-info';
import getSupply from '../queries/get-supply';
import * as env from '../config/env';

/**
 * 
 */
export class Vault implements VaultBase {
  readonly connector: Connector;
  readonly contract: any;

  /**
   * 
   */
  public constructor(vaultId: string, connector: Connector) {
    this.connector = connector;
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
    return new this.connector.web3.eth.Contract(env.tokenAbi, vaultId, { gas: 6000000 });
  }

}
