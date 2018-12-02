import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import { RpcClient, RpcClientOptions } from './client';

/**
 * 
 */
export interface WsProviderOptions extends RpcClientOptions {
  accountId?: string;
  signMethod?: SignMethod,
}

/**
 * Metamask RPC client.
 */
export class WsProvider extends GenericProvider {

  /**
   * Class constructor.
   */
  public constructor(options: WsProviderOptions) {
    super(options);

    this.client = new RpcClient({ 
      url: 'ws://localhost:8546',
      ...options,
    });
  }

  /**
   * 
   */
  public isSupported() {
    return !!window && !!window['Websocket'];
  }
  
}
