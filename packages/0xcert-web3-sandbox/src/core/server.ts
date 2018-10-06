import * as Web3 from 'web3';
import { Ganache } from '../lib/ganache';
import { Protocol } from './protocol';

/**
 * Sandbox server for testing Ethereum code.
 */
export class Sandbox extends Ganache {
  public port: number;
  public host: string;
  public web3: Web3;
  public protocol: Protocol;

  /**
   * Starts the server.
   */
  public async listen(port = 8545, host = '127.0.0.1') {
    this.port = port;
    this.host = host;

    super.listen(port, host);

    this.web3 = new Web3(`http://${host}:${port}`);
    this.protocol = await Protocol.deploy(this.web3);

    return this;
  }

  /**
   * Stops the server.
   */
  public async close() {
    super.close();

    if (this.protocol) {
      this.port = undefined;
      this.host = undefined;
      this.web3 = undefined;
      this.protocol = undefined;
    }

    return this;
  }

}
