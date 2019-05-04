import * as ipfsClient from 'ipfs-http-client';

/**
 * IPFS storege config
 */
export interface StorageConfig {

  /**
   * IPFS API URI
   */
  ipfsApiUri?: string;

  /**
   * IPFS API port
   */
  ipfsApiPort?: number;

  /**
   * IPFS API protocol (http or https)
   */
  ipfsApiProtocol?: string;
}

/**
 * IPFS storage class
 */
export class Storage {

  /**
   * IPFS storage configuration
   */
  protected config: StorageConfig;

  /**
   * IPFS client instance
   */
  protected ipfs: any;

  /**
   * Class constructor.
   */
  public constructor(config: StorageConfig) {
    this.config = {
      ipfsApiUri: 'ipfs.infura.io',
      ipfsApiPort: 5001,
      ipfsApiProtocol: 'https',
      ...config,
    };

    this.ipfs = ipfsClient({
      host: this.config.ipfsApiUri,
      port: this.config.ipfsApiPort,
      protocol: this.config.ipfsApiProtocol,
    });
  }

  /**
   * Add new file to IPFS.
   * @param file to be stored on IPFS.
   */
  public async add(file: Buffer) {
    return this.ipfs.add(file);
  }

  /**
   * Fetch the file from IPFS.
   * @param path of the file stored on IPFS.
   */
  public async cat(path: string) {
    const buff = await this.ipfs.cat(path);
    return buff.toString('utf8');
  }

}
