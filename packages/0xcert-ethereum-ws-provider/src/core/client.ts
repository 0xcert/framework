/**
 * File universal Websocket class.
 */
const Websocket = typeof window !== 'undefined'
  ? window['Websocket']
  : require('ws');

/**
 * RPC client options.
 */
export interface RpcClientOptions {
  url: string;
}

/**
 * Simple HTTP client for performing JSON RPC requests.
 */
export class RpcClient {
  public options: RpcClientOptions;
  public ws: any;
  public callbacks: ((err, data) => any)[] = [];
  public lastId: number = 0;

  /**
   * 
   */
  public constructor(options: RpcClientOptions) {
    this.options = options;

    this.ws = new Websocket(this.options.url);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  /**
   * 
   */
  public send(payload: any, callback?: (err, data) => any) {

    if (this.ws.readyState === this.ws.CONNECTING) {
      return setTimeout(() => this.send(payload, callback), 1000);
    }
    else if (this.ws.readyState !== this.ws.OPEN) {
      return setTimeout(() => this.send(payload, callback), 1000);
    }

    const data = {
      id: payload.id || this.getNextId(),
      ...payload,
    };
    this.callbacks[data.id] = callback;

    this.ws.send(
      JSON.stringify(data)
    );
  }

  /**
   * 
   */
  protected onMessage(data) {
    const json = JSON.parse(data);
    
    this.callbacks[json.id](null, data);
  }

  /**
   * 
   */
  protected onError(err) {
    console.log(err);
  }

  /**
   * Returns the next unique ID number`.
   */
  protected getNextId() {
    this.lastId++;
    return this.lastId;
  }

}
