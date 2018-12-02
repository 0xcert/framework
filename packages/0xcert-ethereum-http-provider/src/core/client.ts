/**
 * File universal fetch method.
 */
const fetch = typeof window !== 'undefined'
  ? window.fetch
  : require('node-fetch');

/**
 * RPC client options.
 */
export interface RpcClientOptions {
  cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached' | string;
  credentials?: 'include' | 'same-origin' | 'omit' | string;
  headers?: {[key: string]: string},
  mode?: 'no-cors' | 'cors' | 'same-origin' | string;
  redirect?: 'manual' | 'follow' | 'error' | string;
  url: string;
}

/**
 * Simple HTTP client for performing JSON RPC requests.
 */
export class RpcClient {
  public options: RpcClientOptions;

  /**
   * 
   */
  public constructor(options: RpcClientOptions) {
    this.options = options;
  }

  /**
   * 
   */
  public send(data: any, next?: (err, data) => any) {
    const { url, ...options } = this.options;

    return fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }).then((res) => {
      return res.json();
    }).then((data) => {
      return next ? next(null, data) : data;
    }).catch((err) => {
      if (next) {
        return next(err, null);
      }
      throw err;
    });
  }

}
