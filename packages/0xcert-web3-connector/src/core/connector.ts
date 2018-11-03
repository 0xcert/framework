import { ConnectorBase, ConnectorError, ConnectorIssue, Query, Mutation } from "@0xcert/scaffold";
import { parseError } from '@0xcert/web3-errors';
import * as Web3 from 'web3';
import { SignMethod } from "./types";

/**
 * 
 */
export interface ConnectorAttachOptions {
  makerId?: string;
  minterId?: string;
  exchangeId?: string;
  signMethod?: SignMethod;
  web3?: any;
}

/**
 * 
 */
export class Connector implements ConnectorBase {
  public makerId: string;
  public minterId?: string;
  public exchangeId?: string;
  public signMethod: SignMethod;
  public web3: any;

  /**
   * 
   */
  public async attach(options?: ConnectorAttachOptions) {
    options = options || {};

    this.web3 = this.getWeb3(options.web3);
    this.makerId = await this.getMakerId(options.makerId);
    this.minterId = options.minterId || '0x';
    this.exchangeId = options.exchangeId || '0x';
    this.signMethod = await this.getSignMethod(options.signMethod);

    return this;
  }

  /**
   * 
   */
  public async detach() {
    this.web3 = null;
    this.makerId = null;
    this.signMethod = null;
    this.minterId = null;
    this.exchangeId = null;

    return this;
  }

  /**
   * 
   */
  public async sign(data: string) {
    return `${this.signMethod}:${await this.signData(data)}`;
  }

  /**
   * 
   */
  public async query<T>(resolver: () => Promise<T>): Promise<Query<T>> {
    try {
      return {
        result: await resolver(),
      };
    }
    catch (error) {
      throw parseError(error);
    }
  }

  /**
   * 
   */
  public async mutate(resolver: () => any): Promise<Mutation> {
    try {
      return await new Promise((resolve, reject) => {
        const obj = resolver();
        obj.once('transactionHash', (hash) => resolve({ hash }));
        obj.once('error', reject);
      }).then((d) => {
        return d as Mutation;
      });
    }
    catch (error) {
      throw parseError(error);
    }
  }
  
  /**
   * 
   */
  protected getWeb3(web3?: any) {
    return web3 ? web3 : new Web3('ws://localhost:8545');
  }

  /**
   * 
   */
  protected async getAccounts() {
    try {
      return await this.web3.eth.getAccounts();
    }
    catch (error) {
      throw parseError(error);
    }
  }

  /**
   * 
   */
  protected async getMakerId(makerId?: string) {
    const accounts = await this.getAccounts();

    if (makerId === undefined) {
      makerId = accounts[0];
    }

    if (accounts.indexOf(makerId) === -1) {
      throw new ConnectorError(ConnectorIssue.INVALID_MAKER_ID)
    }

    return makerId;
  }

  /**
   * 
   */
  protected getSignMethod(signMethod?: SignMethod) {
    if (signMethod === undefined) {
      signMethod = SignMethod.ETH_SIGN;
    }

    if ([0, 1, 2].indexOf(signMethod) === -1) {
      throw new ConnectorError(ConnectorIssue.SIGNATURE_UNKNOWN, `Unknown signature method ${signMethod}`);
    }

    return signMethod;
  }

  /**
   * 
   */
  protected async signData(data: string) {
    try {
      switch (this.signMethod) {
        case SignMethod.ETH_SIGN:
          return await this.web3.eth.sign(data, this.makerId);
        case SignMethod.TREZOR:
          return '';
        case SignMethod.EIP712:
          return '';
        default:
          return null;
      }
    }
    catch (error) {
      throw new ConnectorError(ConnectorIssue.SIGNATURE_FAILED, error);
    }
  }

}
