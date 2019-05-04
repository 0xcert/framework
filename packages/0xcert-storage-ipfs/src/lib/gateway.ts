import { fetch } from '@0xcert/utils';

/**
 * IPFS gateway config
 */
export interface GatewayConfig {

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

}

/**
 * IPFS gateway class
 */
export class Gateway {

  /**
   * IPFS gateway configuration
   */
  protected config: GatewayConfig;

  /**
   * IPFS client instance
   */
  protected ipfs: any;

  /**
   * Class constructor.
   */
  public constructor(config: GatewayConfig) {
    this.config = {
      ipfsGatewayUri: 'ipfs.io',
      ipfsGatewayPort: 443,
      ipfsGatewayProtocol: 'https',
      ...config,
    };
  }

  /**
   * Fetch the file from IPFS.
   * @param path of the file stored on IPFS.
   */
  public async get(path: string) {
    const res = await fetch(`${this.config.ipfsGatewayProtocol}://${this.config.ipfsGatewayUri}:${this.config.ipfsGatewayPort}/ipfs/${path}`).then((r) => r);
    return res;
  }

}
