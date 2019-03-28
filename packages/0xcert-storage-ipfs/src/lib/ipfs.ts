import { fetch } from '@0xcert/utils';
import * as ipfsClient from 'ipfs-http-client';

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
  private ipfs: any;

  /**
   * Class constructor.
   */
  public constructor(options: OptionsIPFS) {
    this.gateway = typeof options.gateway !== 'undefined' ? options.gateway : 'https://ipfs.io';
    this.api = typeof options.api !== 'undefined' ? options.api : 'ipfs.infura.io';
    this.ipfs = ipfsClient({
      host: this.api,
      port: 5001,
      protocol: 'https',
    });
  }

  public async add(file: any) {
    return this.ipfs.add(file);
  }

  public async get(hash: string) {
    const res = await fetch(`${this.gateway}/ipfs/${hash}`).then((r) => r);
    return res;
  }
}
