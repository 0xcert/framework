import { RpcResponse, SendOptions, SignMethod } from './types';
import { parseError } from './errors';

/**
 * 
 */
export interface GenericProviderOptions {
  accountId?: string;
  client?: any;
  signMethod?: SignMethod;
  unsafeRecipientIds?: string[];
}

/**
 * Ethereum RPC client.
 */
export class GenericProvider {
  public accountId: string;
  public signMethod: SignMethod;
  public unsafeRecipientIds: string[];
  protected $client: any;
  protected $id: number = 0;

  /**
   * Class constructor.
   * @param options.client RPC client instance (e.g. window.ethereum).
   * @param options.accountId Coinbase address.
   */
  public constructor(options: GenericProviderOptions) {
    this.accountId = options.accountId;
    this.signMethod = options.signMethod || SignMethod.ETH_SIGN;
    this.unsafeRecipientIds = options.unsafeRecipientIds || [];

    this.$client = options.client && options.client.currentProvider
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
  public async post(options: SendOptions): Promise<RpcResponse> {
    
    // TODO: testi if this works if error throwing works on ropsten or do we need to check if the 
    // resulting gas amount is the same as block gas amount => revert.
    // if making a transaction where gas is not defined we calculate it using estimateGas.
    if(options.method === 'eth_sendTransaction'
      && options.params.length > 0)
    {
      if(options.params[0].gas === undefined)
      {
        options.method = 'eth_estimateGas';
        const res = await new Promise<RpcResponse>((resolve, reject) => {
          this.$client.send({
            jsonrpc: '2.0',
            id: this.getNextId(),
            ...options,
          }, (err, res) => {
            if (err) {
              return reject(err);
            }
            else if (res.error) {
              return reject(res.error);
            }
            return resolve(res);
          });
        }).catch((err) => {
          throw parseError(err);
        });

        // estimate gas is sometimes in accurate (depends on the node). So to be sure we have enough
        // gas we multiply result with 1.1.
        options.params[0].gas = res.result * 1.1;
        options.method = 'eth_sendTransaction';
      }

      if(options.params[0].gasPrice === undefined)
      {
        // get gas price
        const res = await new Promise<RpcResponse>((resolve, reject) => {
          this.$client.send({
            jsonrpc: '2.0',
            method: 'eth_gasPrice',
            params: [],
            id: this.getNextId()
          }, (err, res) => {
            if (err) {
              return reject(err);
            }
            else if (res.error) {
              return reject(res.error);
            }
            return resolve(res);
          });
        }).catch((err) => {
          throw parseError(err);
        });

        // TODO: get multiplyer from provider settings
        const multiplyer = 1.1;
        // set gas price
        options.params[0].gasPrice = res.result * multiplyer;
      }
    }
    
    const requestIndex = options.id || this.getNextId();
    return new Promise<RpcResponse>((resolve, reject) => {
      this.$client.send({
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
  protected getNextId() {
    this.$id++;
    return this.$id;
  }

}
