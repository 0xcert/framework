import { ContextBase, ConnectorError, ConnectorIssue, Query, Mutation } from "@0xcert/scaffold";
import { parseError } from '@0xcert/web3-error-parser';
import { SignMethod } from "./types";

/**
 * 
 */
export interface ContextOptions {
  myId?: string;
  signMethod?: SignMethod;
  web3: any;
}

/**
 * 
 */
export class Context implements ContextBase {
  public myId: string;
  public signMethod: SignMethod;
  public web3: any;

  /**
   * 
   */
  public constructor(options: ContextOptions) {
    this.myId = options.myId;
    this.signMethod = this.getSignMethod(options.signMethod);
    this.web3 = options.web3;
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
    from = from || this.myId;

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
        promise.once('receipt', (tx) => resolve({ id: tx.transactionHash })); // this event may still throw errors
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
    from = from || this.myId;

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
        promise.once('transactionHash', (id) => resolve({ id }));
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
          return await this.web3.eth.sign(data, this.myId);
        default:
          return null;
      }
    }
    catch (error) {
      throw new ConnectorError(ConnectorIssue.SIGNATURE_FAILED, error);
    }
  }

}
