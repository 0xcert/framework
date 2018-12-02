import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import { RpcClient, RpcClientOptions } from './client';

/**
 * 
 */
export interface HttpProviderOptions extends RpcClientOptions {
  accountId?: string;
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
    super(options);

    this.client = new RpcClient({ 
      url: 'http://localhost:8545',
      ...options,
    });
  }

  /**
   * 
   */
  public isSupported() {
    return typeof window === 'undefined' || window.fetch;
  }
  
}
