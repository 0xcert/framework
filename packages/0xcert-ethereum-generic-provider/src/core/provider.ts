import { EventEmitter } from "events";
import { RpcResponse, SendOptions, SignMethod, ProviderEvent } from './types';
import { parseError } from './errors';

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
  public accountId: string;
  public signMethod: SignMethod;
  protected client: any;
  protected requestIndex: number = 0;

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
