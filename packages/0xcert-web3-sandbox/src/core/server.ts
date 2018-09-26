import * as Web3 from 'web3';
import { Ganache } from '../lib/ganache';
import { Protocol } from './protocol';

/**
 * Sandbox server for testing Ethereum code.
 */
export class Sandbox extends Ganache {
  public protocol: Protocol;

  /**
   * Starts the server.
   */
  public async listen(port = 8545, host = '127.0.0.1') {
    super.listen(port, host);

    this.protocol = await Protocol.deploy(
      new Web3(`http://${host}:${port}`)
    );

    return this;
  }

  /**
   * Stops the server.
   */
  public async close() {
    super.close();

    if (this.protocol) {
      this.protocol = null;
    }

    return this;
  }

}
