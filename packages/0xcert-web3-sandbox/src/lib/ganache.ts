import * as cli from 'ganache-cli';

/**
 * Sandbox server for testing Ethereum code.
 */
export class Ganache {
  protected server: any;

  /**
   * Starts the server.
   */
  public static listen(port = 8545, host = '127.0.0.1') {
    return new Ganache().listen(port, host);
  }

  /**
   * Starts the server.
   */
  public async listen(port = 8545, host = '127.0.0.1') {

    await new Promise((resolve, reject) => {
      this.server = cli.server();
      this.server.listen(port, host, (e) => e ? reject(e) : resolve());
    });

    return this;
  }

  /**
   * Stops the server.
   */
  public async close() {

    if (this.server) {
      this.server.close();
      this.server = null;
    }

    return this;
  }

}
