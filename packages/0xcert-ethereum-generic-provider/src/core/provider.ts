import { EventEmitter } from "events";
import * as getBlockByNumber from '../procedures/get-block-by-number';
import * as getTransactionByHash from '../procedures/get-transaction-by-hash';
import * as mutateContract from '../procedures/mutate-contract';
import * as queryContract from '../procedures/query-contract';
import * as sign from '../procedures/sign';
import { TransactionObject, BlockObject, RpcResponse, QuantityTag,
  ContractQueryOptions, ContractMutationOptions, SendOptions, SignOptions,
  SignMethod, ProviderEvent } from './types';
import { parseError } from './errors';
import { Mutation } from './mutation';

/**
 * 
 */
export interface GenericProviderOptions {
  accountId?: string;
  client?: any;
  signMethod?: SignMethod;
}

/**
 * Ethereum RPC client.
 */
export class GenericProvider extends EventEmitter {
  protected client: any;
  protected requestIndex: number = 0;
  public accountId: string;
  public signMethod: SignMethod;

  /**
   * Class constructor.
   * @param options.client RPC client instance (e.g. window.ethereum).
   * @param options.accountId Coinbase address.
   */
  public constructor(options: GenericProviderOptions) {
    super();
    
    this.accountId = options.accountId;
    this.signMethod = options.signMethod || SignMethod.ETH_SIGN;

    this.client = options.client && options.client.currentProvider
      ? options.client.currentProvider
      : options.client;
    
    if (this.client) {
      this.client.on(ProviderEvent.NETWORK_CHANGE, () => this.emit(ProviderEvent.NETWORK_CHANGE));
      this.client.on(ProviderEvent.ACCOUNT_CHANGE, () => this.emit(ProviderEvent.ACCOUNT_CHANGE));
    }
  }

  /**
   * 
   */
  public emit(event: ProviderEvent) {
    return super.emit(event);
  }

  /**
   * 
   */
  public on(event: ProviderEvent, handler: () => any) {
    return super.on(event, handler);
  }

  /**
   * 
   */
  public once(event: ProviderEvent, handler: () => any) {
    return super.once(event, handler);
  }

  /**
   * 
   */
  public off(event: ProviderEvent, handler?: () => any) {
    if (handler) {
      return super.off(event, handler);
    }
    else {
      return super.removeAllListeners(event);
    }
  }

  /**
   * Returns block information.
   * @param tag Block number or tag.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber
   */
  public async getBlockByNumber(tag: QuantityTag): Promise<BlockObject> {
    return this.send({
      method: 'eth_getBlockByNumber',
      params: getBlockByNumber.buildParams(tag),
    }).then((res) => {
      return getBlockByNumber.parseResult(res);
    });
  }

  /**
   * Returns transaction information.
   * @param hash Transaction hash.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionbyhash
   */
  public async getTransactionByHash(hash: string): Promise<TransactionObject> {
    return this.send({
      method: 'eth_getTransactionByHash',
      params: getTransactionByHash.buildParams(hash),
    }).then((res) => {
      return getTransactionByHash.parseResult(res);
    });
  }

  /**
   * Performs a mutation operation on a smart contract.
   * @param options.from Sender's wallet address.
   * @param options.to Contract address.
   * @param options.abi Contract method ABI.
   * @param options.tag Block number or tag.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction
   */
  public async mutateContract(options: ContractMutationOptions): Promise<Mutation> {
    options = {
      from: this.accountId,
      ...options,
    };
    return this.send({
      method: 'eth_sendTransaction',
      params: mutateContract.buildParams(options),
    }).then((res) => {
      return mutateContract.parseResult(res);
    }).then((id) => {
      return new Mutation(this, id);
    });
  }

  /**
   * Performs a query operation on a smart contract.
   * @param options.to Contract address.
   * @param options.abi Contract method ABI.
   * @param options.tag Block number or tag.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
   */
  public async queryContract<T=any[]>(options: ContractQueryOptions): Promise<T> {
    return this.send({
      method: 'eth_call',
      params: queryContract.buildParams(options),
    }).then((res) => {
      return queryContract.parseResult(options, res);
    });
  }

  /**
   * Signs a message.
   * @param options.from Signer's wallet address.
   * @param options.message Text tobe signed.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign
   */
  public async sign(options: SignOptions): Promise<string> {
    options = {
      from: this.accountId,
      signMethod: this.signMethod,
      ...options,
    };
    return this.send({
      method: 'eth_sign',
      params: sign.buildParams(options),
    }).then((res) => {
      return sign.parseResult(options, res);
    });
  }

  /**
   * Sends a raw RPC request through the provider.
   * @param options.method RPC procedure name.
   * @param options.params RPC procedure parameters.
   * @param options.id RPC request identifier.
   * @param options.jsonrpc RPC protocol version.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC
   */
  public async send(options: SendOptions): Promise<RpcResponse> {
    const requestIndex = this.getUniqueRequestIndex();

    return new Promise<RpcResponse>((resolve, reject) => {
      this.client.send({
        jsonrpc: '2.0',
        id: requestIndex,
        ...options,
      }, (err, res) => {
        if (err) { // client error
          return reject(err);
        }
        else if (res.error) { // RPC error
          return reject(res.error);
        }
        else if (res.id !== requestIndex) { // anomaly
          return reject('Invalid RPC id');
        }
        return resolve(res);
      });
    }).catch((err) => {
      throw parseError(err);
    });
  }

  /**
   * Returns the next unique instance `requestIndex`.
   */
  protected getUniqueRequestIndex() {
    this.requestIndex++;
    return this.requestIndex;
  }

}
