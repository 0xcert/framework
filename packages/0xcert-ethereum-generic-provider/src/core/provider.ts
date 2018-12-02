import { RpcResponse, SendOptions, SignMethod } from './types';
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
export class GenericProvider {
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
    this.accountId = options.accountId;
    this.signMethod = options.signMethod || SignMethod.ETH_SIGN;

    this.client = options.client && options.client.currentProvider
      ? options.client.currentProvider
      : options.client;
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
