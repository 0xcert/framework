import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import { fetch } from '@0xcert/utils';

/**
 * HTTP RPC client options interface.
 */
export interface HttpProviderOptions {
  accountId?: string;
  cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached' | string;
  credentials?: 'include' | 'same-origin' | 'omit' | string;
  headers?: {[key: string]: string};
  mode?: 'no-cors' | 'cors' | 'same-origin' | string;
  redirect?: 'manual' | 'follow' | 'error' | string;
  signMethod?: SignMethod;
  unsafeRecipientIds?: string[];
  assetLedgerSource?: string;
  valueLedgerSource?: string;
  requiredConfirmations?: number;
  orderGatewayId?: string;
  url: string;
}

/**
 * HTTP RPC client.
 */
export class HttpProvider extends GenericProvider {
  protected $options: HttpProviderOptions;

  /**
   * Class constructor.
   */
  public constructor(options: HttpProviderOptions) {
    super(options);

    this.$options = options;
    this.$client = this;
  }

  /**
   * Returns a new provider instance.
   * @param options HTTP provider options.
   */
  public static getInstance(options: HttpProviderOptions): HttpProvider {
    return new HttpProvider(options);
  }

  /**
   * 
   */
  public isSupported() {
    return !!this.$client.fetch;
  }

  /**
   * 
   */
  public send(data: any, callback: (err, data) => any) {

    const { url, ...options } = {
      url: 'http://localhost:8545',
      ...this.$options,
    };

    return fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }).then((res) => {
      return res.json();
    }).then((data) => {
      return callback(null, data);
    }).catch((err) => {
      return callback(err, null);
    });
  }

}
