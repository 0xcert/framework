import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import * as Web3WsProvider from 'web3-providers-ws';

/**
 * 
 */
export interface HttpProviderOptions {
  host?: string;
  timeout?: number;
  headers?: {
    name: string;
    value: string;
  }[];
  signMethod?: SignMethod,
}

/**
 * Metamask RPC client.
 */
export class HttpProvider extends GenericProvider {

  /**
   * Class constructor.
   */
  public constructor(options: HttpProviderOptions) {
    super({});

    options = { 
      signMethod: SignMethod.ETH_SIGN,
      host: 'ws://localhost:8546',
      timeout: 20000,
      headers: [],
      ...options,
    };

    this.signMethod = options.signMethod;

    const headers = {};
    options.headers.forEach((h) => headers[h.name] = h.value);

    this.client = new Web3WsProvider(
      options.host,
      {
        timeout: options.timeout,
        headers,
      }
    );
  }

  /**
   * 
   */
  public isSupported() {
    return true;
  }
  
}
