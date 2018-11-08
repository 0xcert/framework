import { ContextBase, ConnectorError, ConnectorIssue, Query, Mutation } from "@0xcert/scaffold";
import { parseError } from '@0xcert/web3-error-parser';
import * as Web3 from 'web3';
import { SignMethod } from "./types";

/**
 * 
 */
export interface ContextAttachOptions {
  exchangeId?: string;
  myId?: string;
  signMethod?: SignMethod;
  web3?: any;
}

/**
 * 
 */
export class Context implements ContextBase {
  readonly platform: string = 'web3';
  public exchangeId?: string;
  public myId: string;
  public signMethod: SignMethod;
  public web3: any;

  /**
   * 
   */
  public constructor(options?: ContextAttachOptions) {
    options = options || {};

    this.web3 = this.getWeb3(options.web3);
    this.myId = options.myId;
    this.exchangeId = options.exchangeId || '0x';
    this.signMethod = this.getSignMethod(options.signMethod)
  }

  /**
   * 
   */
  public async attach() {
    this.myId = await this.getAccountId(this.myId);

    return this;
  }

  /**
   * 
   */
  public async detach() {
    this.exchangeId = null;
    this.myId = null;
    this.signMethod = null;
    this.web3 = null;

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
  public async mutate(resolver: () => Promise<any>, from?: string): Promise<Mutation> {
    from = await this.getAccountId(from || this.myId);

    try {
      const multiplyer = 1.2;
      const obj = await resolver();
      let gas = await obj.estimateGas({ from });
      // We increase gas since estimateGas can be wrong see: https://ethereum.stackexchange.com/questions/266/what-are-the-limitations-to-estimategas-and-when-would-its-estimate-be-considera
      gas = new this.web3.utils.BN(gas * 1.1);
      const price = await this.web3.eth.getGasPrice().then((p) => p * multiplyer);
      const gasLimit = await this.web3.eth.getBlock('latest').then((b) => b.gasLimit);
      
      if (gas > gasLimit) {
        throw 'Gas exceeds max allowed gas';
      }

      return await new Promise((resolve, reject) => {
        const promise = obj.send({ from, gas, price });
        promise.once('receipt', (tx) => resolve({ hash: tx.transactionHash })); // this event may still throw errors
        promise.once('error', reject);
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
  public async transfer(data: { value: number, to: string }, from?: string): Promise<Mutation> {
    from = await this.getAccountId(from || this.myId);

    try {
      const multiplyer = 1.2;
      const { value, to } = data;
      const gas = await this.web3.eth.estimateGas({ from, to, value });
      const gasPrice = await this.web3.eth.getGasPrice().then((p) => p * multiplyer);
      const gasLimit = await this.web3.eth.getBlock('latest').then((b) => b.gasLimit);
      
      if (gas > gasLimit) {
        throw 'Gas exceeds max allowed gas';
      }

      return await new Promise((resolve, reject) => {
        const promise = this.web3.eth.sendTransaction({ from, to, value, gas, gasPrice });
        promise.once('transactionHash', (hash) => resolve({ hash }));
        promise.once('error', reject);
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
  protected async getAccountId(accountid?: string) {
    const accounts = await this.getAccounts();

    if (accountid === undefined) {
      accountid = accounts[0];
    }

    if (accounts.indexOf(accountid) === -1) {
      throw new ConnectorError(ConnectorIssue.INVALID_MAKER_ID)
    }

    return accountid;
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
          return await this.web3.eth.sign(data, this.myId);
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
