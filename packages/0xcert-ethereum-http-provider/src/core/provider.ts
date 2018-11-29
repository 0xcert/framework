import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import * as Web3HttpProvider from 'web3-providers-http';

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
      host: 'http://localhost:8545',
      timeout: 20000,
      headers: [],
      ...options,
    };

    this.signMethod = options.signMethod;

    this.client = new Web3HttpProvider(
      options.host,
      {
        timeout: options.timeout,
        headers: [...options.headers],
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
