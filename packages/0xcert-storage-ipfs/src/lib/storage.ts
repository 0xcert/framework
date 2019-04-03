import { fetch } from '@0xcert/utils';
import * as ipfsClient from 'ipfs-http-client';

export interface StorageConfig {

  /**
   * IPFS gateway URI
   */
  ipfsGatewayUri?: string;

  /**
   * IPFS gateway port
   */
  ipfsGatewayPort?: number;

  /**
   * IPFS gateway protocol (http or https)
   */
  ipfsGatewayProtocol?: string;

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

export class Storage {

  /**
   * IPFS storage configuration
   */
  protected config: StorageConfig;

  /**
   * IPFS client instance
   */
  private ipfs: any;

  /**
   * Class constructor.
   */
  public constructor(config: StorageConfig) {
    this.config = {
      ipfsGatewayUri: 'ipfs.io',
      ipfsGatewayPort: 443,
      ipfsGatewayProtocol: 'https',
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
   */
  public async add(file: Buffer) {
    return this.ipfs.add(file);
  }

  /**
   * Fetch the file from IPFS.
   */
  public async get(hash: string) {
    const res = await fetch(`${this.config.ipfsGatewayProtocol}://${this.config.ipfsGatewayUri}:${this.config.ipfsGatewayPort}/ipfs/${hash}`).then((r) => r);
    return res;
  }
}
