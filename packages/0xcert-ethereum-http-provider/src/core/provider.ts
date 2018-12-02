import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';

/**
 * File universal fetch method.
 */
const fetch = typeof window !== 'undefined'
  ? window.fetch
  : require('node-fetch');

/**
 * 
 */
export interface HttpProviderOptions {
  accountId?: string;
  cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached' | string;
  credentials?: 'include' | 'same-origin' | 'omit' | string;
  headers?: {[key: string]: string},
  mode?: 'no-cors' | 'cors' | 'same-origin' | string;
  redirect?: 'manual' | 'follow' | 'error' | string;
  signMethod?: SignMethod,
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
    this.client = this;
  }

  /**
   * 
   */
  public isSupported() {
    return !!this.client.fetch;
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
