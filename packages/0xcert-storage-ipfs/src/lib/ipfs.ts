import { ipfsClient } from 'ipfs-http-client';

export interface OptionsIPFS {

  /**
   * IPFS gateway URI
   */
  gateway?: string;

  /**
   * IPFS API URI
   */
  api?: string;
}

export class StorageIPFS {

  /**
   * IPFS gateway URI
   */
  public gateway: string;

  /**
   * IPFS API URI
   */
  public api: string;

  /**
   * IPFS client instance
   */
  private ipfs: ipfsClient;

  /**
   * Class constructor.
   */
  public constructor(options: OptionsIPFS) {
    this.gateway = typeof options.gateway !== 'undefined' ? options.gateway : 'https://ipfs.io:8080';
    this.api = typeof options.api !== 'undefined' ? options.api : 'ipfs.infura.io';
    this.ipfs = new ipfsClient({
      host: this.gateway,
      port: 5001,
      protocol: 'https',
    });
  }

  public async add(file: any) {
    return this.ipfs.add(file);
  }

  public async get(hash: string) {
    return this.ipfs.get(`/ipfs/${hash}`);
  }
}
