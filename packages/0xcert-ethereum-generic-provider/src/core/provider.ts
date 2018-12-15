import { RpcResponse, SendOptions, SignMethod } from './types';
import { parseError } from './errors';

/**
 * Configuration interface for generic provider.
 */
export interface GenericProviderOptions {
  accountId?: string;
  client?: any;
  signMethod?: SignMethod;
  unsafeRecipientIds?: string[];
  assetLedgerSource?: string;
  valueLedgerSource?: string;
  requiredConfirmations?: number;
}

/**
 * Ethereum RPC client.
 */
export class GenericProvider {
  public accountId: string;
  public signMethod: SignMethod;
  public unsafeRecipientIds: string[];
  public assetLedgerSource: string;
  public valueLedgerSource: string;
  public requiredConfirmations: number;
  protected $client: any;
  protected $id: number = 0;

  /**
   * Class constructor.
   * @param options.client RPC client instance (e.g. window.ethereum).
   * @param options.accountId Coinbase address.
   */
  public constructor(options: GenericProviderOptions) {
    this.accountId = options.accountId;
    this.unsafeRecipientIds = options.unsafeRecipientIds || [];
    this.assetLedgerSource = options.assetLedgerSource || 'https://cdn.jsdelivr.net/gh/xpepermint/0xcert-contracts/asset-ledger.json',
    this.valueLedgerSource = options.valueLedgerSource || 'https://cdn.jsdelivr.net/gh/xpepermint/0xcert-contracts/value-ledger.json',
    this.signMethod = typeof options.signMethod !== 'undefined' ? options.signMethod : SignMethod.ETH_SIGN;
    this.requiredConfirmations = typeof options.requiredConfirmations !== 'undefined' ? options.requiredConfirmations : 1;
    
    this.$client = options.client && options.client.currentProvider
      ? options.client.currentProvider
      : options.client;
  }

  /**
   * Sends a raw request to the JSON RPC serveer.
   * @param options.method RPC procedure name.
   * @param options.params RPC procedure parameters.
   * @param options.id RPC request identifier.
   * @param options.jsonrpc RPC protocol version.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC
   */
  public async post(options: SendOptions): Promise<RpcResponse> {
    const payload = { ...options };

    // TODO: test if error throwing works on ropsten or do we need to check if
    // the resulting gas amount is the same as block gas amount => revert.
    if (payload.method === 'eth_sendTransaction' && payload.params.length) {

      if (typeof payload.params[0].gas === 'undefined') {
        const res = await this.request({
          ...payload,
          method: 'eth_estimateGas',
        });
        // estimate gas is sometimes inaccurate (depends on the node). So to be
        // sure we have enough gas, we multiply result with a factor.
        payload.params[0].gas = Math.ceil(res.result * 1.1).toString(16);
      }

      if (typeof payload.params[0].gasPrice === 'undefined') {
        const res = await this.request({
          ...payload,
          method: 'eth_gasPrice',
        });
        // TODO: get multiplyer from provider settings
        payload.params[0].gasPrice = Math.ceil(res.result * 1.1).toString(16);
      }
    }

    return this.request(payload);
  }

  /**
   * Sends a raw request to the JSON RPC serveer.
   * @param options.method RPC procedure name.
   * @param options.params RPC procedure parameters.
   * @param options.id RPC request identifier.
   * @param options.jsonrpc RPC protocol version.
   * @see https://github.com/ethereum/wiki/wiki/JSON-RPC
   */
  protected async request(options: SendOptions) {
    const payload = {
      jsonrpc: '2.0',
      id: options.id || this.getNextId(),
      params: [],
    ...options,
    };
    return new Promise<RpcResponse>((resolve, reject) => {
      this.$client.send(payload, (err, res) => {
        if (err) { // client error
          return reject(err);
        }
        else if (res.error) { // RPC error
          return reject(res.error);
        }
        else if (res.id !== payload.id) { // anomaly
          return reject('Invalid RPC id');
        }
        return resolve(res);
      });
    }).catch((err) => {
      throw parseError(err);
    });
  }

  /**
   * Returns the next unique request number.
   */
  protected getNextId() {
    this.$id++;
    return this.$id;
  }

}
