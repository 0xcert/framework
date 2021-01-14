import * as ganache from 'ganache-core';
import * as Web3 from 'web3';
import { Protocol } from './protocol';

/**
 * Sandbox configuration options.
 */
export interface SandboxOptions {
  port?: number;
  blockTime?: number;
}

/**
 * Sandbox server for testing Ethereum code.
 */
export class Sandbox {
  public server: any;
  public web3: any;
  public protocol: Protocol;

  /**
   * Returns and instance of a sandbox Web3 provider.
   * @param options Sandbox configuration options.
   */
  public static createProvider(options?: SandboxOptions) {
    const provider = ganache['provider'](options);
    provider.setMaxListeners(999999); // hide MaxListenersExceededWarning produced by ganache provider.
    return provider;
  }

  /**
   * Starts the server.
   * @param options Sandbox configuration options.
   */
  public static listen(options?: SandboxOptions) {
    return new Sandbox().listen(options);
  }

  /**
   * Starts the server.
   * @param options Sandbox configuration options.
   */
  public async listen(options?: SandboxOptions) {
    options = { ...options };

    await new Promise((resolve, reject) => {
      this.server = ganache['server']();
      this.server.listen(options.port, (e) => e ? reject(e) : resolve(null));
    });

    this.web3 = new (Web3 as any)(Sandbox.createProvider(options));
    this.protocol = await Protocol.deploy(this.web3);

    return this;
  }

  /**
   * Stops the server.
   */
  public async close() {

    if (this.server) {
      this.server.close();
      this.server = null;
      this.web3 = undefined;
      this.protocol = undefined;
    }

    return this;
  }

}
