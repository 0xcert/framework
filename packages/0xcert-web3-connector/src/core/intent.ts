import { EventEmitter } from 'eventemitter3';
import { Connector } from './connector';
import * as env from '../config/env';

/**
 * Abstract Web3 mutation class.
 */
export abstract class Web3Intent extends EventEmitter {
  protected connector: Connector;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   */
  public constructor(connector: Connector) {
    super();
    this.connector = connector;
  }

  /**
   * Returns Xcert smart contract instance.
   */
  protected getFolder(folderId: string) {
    return new this.connector.web3.eth.Contract(env.xcertAbi, folderId);
  }

  /**
   * Returns the provided accountId
   */
  protected async getAccount(accountId?: string) {
    return accountId ? accountId : await this.connector.web3.eth.getAccounts().then((a) => a[0]);
  }

}
