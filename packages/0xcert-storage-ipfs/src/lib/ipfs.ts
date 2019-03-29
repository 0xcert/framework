import { fetch } from '@0xcert/utils';
import * as ipfsClient from 'ipfs-http-client';

export interface OptionsIPFS {

  /**
   * IPFS gateway
   */
  gatewayUri?: string;
  gatewayPort?: number;
  gatewayProtocol?: string;

  /**
   * IPFS API
   */
  apiUri?: string;
  apiPort?: number;
  apiProtocol?: string;
}

export class StorageIPFS {

  /**
   * IPFS gateway
   */
  public gatewayUri: string;
  public gatewayPort: number;
  public gatewayProtocol: string;

  /**
   * IPFS API
   */
  public apiUri: string;
  public apiPort: number;
  public apiProtocol: string;

  /**
   * IPFS client instance
   */
  private ipfs: any;

  /**
   * Class constructor.
   */
  public constructor(options: OptionsIPFS) {
    this.gatewayUri = typeof options.gatewayUri !== 'undefined' ? options.gatewayUri : 'ipfs.io';
    this.gatewayPort = typeof options.gatewayPort !== 'undefined' ? options.gatewayPort : 443;
    this.gatewayProtocol = typeof options.gatewayProtocol !== 'undefined' ? options.gatewayProtocol : 'https';

    this.apiUri = typeof options.apiUri !== 'undefined' ? options.apiUri : 'ipfs.infura.io';
    this.apiPort = typeof options.apiPort !== 'undefined' ? options.apiPort : 5001;
    this.apiProtocol = typeof options.apiProtocol !== 'undefined' ? options.apiProtocol : 'https';

    this.ipfs = ipfsClient({
      host: this.apiUri,
      port: this.apiPort,
      protocol: this.apiProtocol,
    });
  }

  public async add(file: any) {
    return this.ipfs.add(file);
  }

  public async get(hash: string) {
    const res = await fetch(`${this.gatewayProtocol}://${this.gatewayUri}:${this.gatewayPort}/ipfs/${hash}`).then((r) => r);
    return res;
  }
}
