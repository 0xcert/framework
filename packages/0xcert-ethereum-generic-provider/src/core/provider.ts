import { Encode, Encoder } from '@0xcert/ethereum-utils';
import { ProviderBase, ProviderEvent } from '@0xcert/scaffold';
import { EventEmitter } from 'events';
import { parseError } from './errors';
import { GatewayConfig, RpcResponse, SendOptions, SignMethod } from './types';

/**
 * Configuration interface for generic provider.
 */
export interface GenericProviderOptions {

  /**
   * Default account from which all mutations are made.
   */
  accountId?: string;

  /**
   * RPC client instance (e.g. window.ethereum).
   */
  client?: any;

  /**
   * Type of signature that will be used in making claims etc.
   */
  signMethod?: SignMethod;

  /**
   * List of addresses where normal transfer not safeTransfer smart contract methods will be used.
   */
  unsafeRecipientIds?: string[];

  /**
   * Source where assetLedger compiled smart contract is located.
   */
  assetLedgerSource?: string;

  /**
   * Source where valueLedger compiled smart contract is located.
   */
  valueLedgerSource?: string;

  /**
   * Number of confirmations (blocks in blockchain after mutation is accepted) are necessary to mark a mutation complete.
   */
  requiredConfirmations?: number;

  /**
   * Gateway configuration.
   */
  gatewayConfig?: GatewayConfig;

  /**
   * The number of milliseconds in which a mutation times out.
   */
  mutationTimeout?: number;

  /**
   * Encoder instance.
   */
  encoder?: Encode;

  /**
   * Gas price multiplier. Defaults to 1.1.
   */
  gasPriceMultiplier?: number;

  /**
   * Sandbox mode. False by default.
   */
  sandbox?: Boolean;
}

/**
 * Ethereum RPC client.
 */
export class GenericProvider extends EventEmitter implements ProviderBase {

  /**
   * Type of signature that will be used in making claims etc.
   */
  public signMethod: SignMethod;

  /**
   * Source where assetLedger compiled smart contract is located.
   */
  public assetLedgerSource: string;

  /**
   * Source where valueLedger compiled smart contract is located.
   */
  public valueLedgerSource: string;

  /**
   * Number of confirmations (blocks in blockchain after mutation is accepted) are necessary to mark a mutation complete.
   */
  public requiredConfirmations: number;

  /**
   * The number of milliseconds in which a mutation times out.
   */
  public mutationTimeout: number;

  /**
   * Instance of encoder.
   */
  public encoder: Encode;

  /**
   * Gas price multiplier. Defaults to 1.1.
   */
  public gasPriceMultiplier?: number;

  /**
   * Sandbox mode. False by default.
   */
  public sandbox: Boolean;

  /**
   * Gateway configuration.
   */
  protected _gatewayConfig: GatewayConfig;

  /**
   * Default account from which all mutations are made.
   */
  protected _accountId: string;

  /**
   * List of addresses where normal transfer not safeTransfer smart contract methods will be used.
   */
  protected _unsafeRecipientIds: string[];

  /**
   * RPC client instance (e.g. window.ethereum).
   */
  protected _client: any;

  /**
   * Unique request number.
   */
  protected _id = 0;

  /**
   * Class constructor.
   * @param options.client RPC client instance (e.g. window.ethereum).
   * @param options.accountId Coinbase address.
   */
  public constructor(options: GenericProviderOptions) {
    super();
    this.encoder = typeof options.encoder !== 'undefined' ? options.encoder : new Encoder();
    this.accountId = options.accountId;
    this.gatewayConfig = options.gatewayConfig;
    this.unsafeRecipientIds = options.unsafeRecipientIds;
    this.assetLedgerSource = options.assetLedgerSource || 'https://conventions.0xcert.org/xcert-mock.json';
    this.valueLedgerSource = options.valueLedgerSource || 'https://conventions.0xcert.org/token-mock.json';
    this.signMethod = typeof options.signMethod !== 'undefined' ? options.signMethod : SignMethod.ETH_SIGN;
    this.requiredConfirmations = typeof options.requiredConfirmations !== 'undefined' ? options.requiredConfirmations : 1;
    this.mutationTimeout = typeof options.mutationTimeout !== 'undefined' ? options.mutationTimeout : 3600000; // 1 h
    this.gasPriceMultiplier = typeof options.gasPriceMultiplier !== 'undefined' ? options.gasPriceMultiplier : 1.1;
    this.sandbox = typeof options.sandbox !== 'undefined' ? options.sandbox : false;

    this._client = options.client && options.client.currentProvider
      ? options.client.currentProvider
      : options.client;
  }

  /**
   * Returns account ID (address).
   */
  public get accountId() {
    return this._accountId || null;
  }

  /**
   * Sets and normalizes account ID.
   */
  public set accountId(id: string) {
    id = this.encoder.normalizeAddress(id);

    if (!this.isCurrentAccount(id)) {
      this.emit(ProviderEvent.ACCOUNT_CHANGE, id, this._accountId); // must be before the new account is set
    }

    this._accountId = id;
  }

  /**
   * Returns unsafe recipient IDs (addresses).
   */
  public get unsafeRecipientIds() {
    return this._unsafeRecipientIds || [];
  }

  /**
   * Sets and normalizes unsafe recipient IDs.
   */
  public set unsafeRecipientIds(ids: string[]) {
    this._unsafeRecipientIds = (ids || []).map((id) => this.encoder.normalizeAddress(id));
  }

  /**
   * Returns gateway config.
   */
  public get gatewayConfig(): GatewayConfig {
    return this._gatewayConfig || null;
  }

  /**
   * Sets and normalizes gateway config.
   */
  public set gatewayConfig(config: GatewayConfig) {
    if (typeof config !== 'undefined') {
      this._gatewayConfig = {
        multiOrderId: this.encoder.normalizeAddress(config.multiOrderId),
        assetLedgerDeployOrderId: this.encoder.normalizeAddress(config.assetLedgerDeployOrderId),
        valueLedgerDeployOrderId: this.encoder.normalizeAddress(config.valueLedgerDeployOrderId),
      };
    } else {
      this._gatewayConfig = null;
    }
  }

  /**
   * Emits provider event.
   */
  public emit(event: ProviderEvent.ACCOUNT_CHANGE, newAccountId: string, oldAccountId: string);
  public emit(event: ProviderEvent.NETWORK_CHANGE, newNetworkVersion: string, oldNetworkVersion: string);
  public emit(...args) {
    super.emit.call(this, ...args);
    return this;
  }

  /**
   * Attaches on provider events.
   */
  public on(event: ProviderEvent.ACCOUNT_CHANGE, handler: (newAccountId: string, oldAccountId: string) => any);
  public on(event: ProviderEvent.NETWORK_CHANGE, handler: (newNetworkVersion: string, oldNetworkVersion: string) => any);
  public on(...args) {
    super.on.call(this, ...args);
    return this;
  }

  /**
   * Once handler.
   */
  public once(event: ProviderEvent.ACCOUNT_CHANGE, handler: (newAccountId: string, oldAccountId: string) => any);
  public once(event: ProviderEvent.NETWORK_CHANGE, handler: (newNetworkVersion: string, oldNetworkVersion: string) => any);
  public once(...args) {
    super.once.call(this, ...args);
    return this;
  }

  /**
   * Dettaches from provider events.
   */
  public off(event: ProviderEvent.ACCOUNT_CHANGE, handler: (newAccountId: string, oldAccountId: string) => any);
  public off(event: ProviderEvent.NETWORK_CHANGE, handler: (newNetworkVersion: string, oldNetworkVersion: string) => any);
  public off(event: ProviderEvent);
  public off(event, handler?) {
    if (handler) {
      super.off(event, handler);
    } else {
      super.removeAllListeners(event);
    }
    return this;
  }

  /**
   * Signs a message.
   * @param message Message to sign.
   */
  public async sign(message: string): Promise<string> {
    if (!this.accountId) {
      throw new Error('accountId not set.');
    }
    if (this.signMethod === SignMethod.PERSONAL_SIGN) {
      const res = await this.post({
        method: 'personal_sign',
        params: [message, this.accountId, null],
      });
      return res.result;
    } else if (this.signMethod === SignMethod.ETH_SIGN) {
      const res = await this.post({
        method: 'eth_sign',
        params: [this.accountId, message],
      });
      return res.result;
    } else {
      throw new Error('Signing method not implemented.');
    }
  }

  /**
   * Returns a list of all available account IDs.
   */
  public async getAvailableAccounts(): Promise<string[]> {
    const res = await this.post({
      method: 'eth_accounts',
      params: [],
    });
    return res.result.map((a) => this.encoder.normalizeAddress(a));
  }

  /**
   * Returns current network type (e.g. '3' for ropsten).
   */
  public async getNetworkVersion(): Promise<string> {
    const res = await this.post({
      method: 'net_version',
      params: [],
    });
    return res.result;
  }

  /**
   * Returns true if the provided accountId maches current class accountId.
   */
  public isCurrentAccount(accountId: string) {
    return this.accountId === this.encoder.normalizeAddress(accountId);
  }

  /**
   * Returns true if the provided ledgerId is unsafe recipient address.
   */
  public isUnsafeRecipientId(ledgerId: string) {
    const normalizedLedgerId = this.encoder.normalizeAddress(ledgerId);
    return !!this.unsafeRecipientIds.find((id) => id === normalizedLedgerId);
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

    if (payload.method === 'eth_sendTransaction' && payload.params.length) {

      if (this.sandbox || typeof payload.params[0].gas === 'undefined') {
        const res = await this.request({
          ...payload,
          method: 'eth_estimateGas',
        });
        // estimate gas is sometimes inaccurate (depends on the node). So to be
        // sure we have enough gas, we multiply result with a factor.
        payload.params[0].gas = `0x${Math.ceil(res.result * 1.1).toString(16)}`;
      }

      if (this.sandbox) {
        return { id: null, jsonrpc: null, result: payload.params[0].gas };
      }

      if (typeof payload.params[0].gasPrice === 'undefined') {
        const res = await this.request({
          ...payload,
          method: 'eth_gasPrice',
          params: [],
        });
        payload.params[0].gasPrice = `0x${Math.ceil(res.result * this.gasPriceMultiplier).toString(16)}`;
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
      this._client.send(payload, (err, res) => {
        if (err) { // client error
          return reject(err);
        } else if (res.error) { // RPC error
          return reject(res.error);
        } else if (res.id !== payload.id) { // anomaly
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
    this._id++;
    return this._id;
  }

}
