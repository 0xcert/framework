import { GenericProvider, ProviderError, ProviderIssue, SignMethod } from '@0xcert/ethereum-generic-provider';
import { fetch } from '@0xcert/utils';

/**
 * HTTP RPC client options interface.
 */
export interface HttpProviderOptions {

  /**
   * Default account from which all mutations are made.
   */
  accountId?: string;

  /**
   * Http call cache options.
   */
  cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached' | string;

  /**
   * Http call credentials.
   */
  credentials?: 'include' | 'same-origin' | 'omit' | string;

  /**
   * Http call headers.
   */
  headers?: {[key: string]: string};

  /**
   * Http call mode.
   */
  mode?: 'no-cors' | 'cors' | 'same-origin' | string;

  /**
   * Http call redirect.
   */
  redirect?: 'manual' | 'follow' | 'error' | string;

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
   * Id (address) of order gateway.
   */
  orderGatewayId?: string;

  /**
   * Url to JSON RPC endpoint.
   */
  url: string;
}

/**
 * HTTP RPC client.
 */
export class HttpProvider extends GenericProvider {

  /**
   * Default options set from constructor.
   */
  protected $options: HttpProviderOptions;

  /**
   * Returns a new provider instance.
   * @param options HTTP provider options.
   */
  public static getInstance(options: HttpProviderOptions): HttpProvider {
    return new HttpProvider(options);
  }

  /**
   * Class constructor.
   */
  public constructor(options: HttpProviderOptions) {
    super(options);

    this.$options = options;
    this.$client = this;
  }

  /**
   * Is provider supported.
   */
  public isSupported() {
    return !!this.$client.fetch;
  }

  /**
   * Sends the RPC call.
   */
  public send(data: any, callback: (err, data) => any) {
    const { url, ...options } = {
      url: 'http://localhost:8524',
      ...this.$options,
    };

    return fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      return res.json();
    }).then((res) => {
      return callback(null, res);
    }).catch((err) => {
      return callback(err, null);
    });
  }

  /**
   * Unlock the specified address for a period of time
   * @param address to be unlocked
   * @param passphrase for the address
   * @param duration defined in seconds
   */
  public async unlockAccount(address: string, passphrase: string, duration?: number) {
    if (duration === undefined) {
      duration = 300;
    }

    await this.post({
      method: 'personal_unlockAccount',
      params: [address, passphrase, duration],
    }).then((res) => {
      return res.result;
    }).catch((err) => {
      throw new ProviderError(ProviderIssue.GENERAL, err);
    });
  }
}
