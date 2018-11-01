import { ConnectorBase } from "@0xcert/connector";
import { Folder } from "@0xcert/web3-folder";

/**
 * 
 */
export interface ConnectorConfig {
  web3: any;
  makerId?: string;
}

/**
 * 
 */
export class Connector implements ConnectorBase {
  protected config: ConnectorConfig;

  /**
   * 
   */
  public constructor(config: ConnectorConfig) {
    this.config = config;
  }

  /**
   * 
   */
  public async getFolder(folderId: string) {
    return new Folder({
      web3: this.config.web3,
      makerId: await this.getMakerId(),
      folderId,
    });
  }

  /**
   * 
   */
  public async getMakerId() {
    return this.config.makerId || await this.config.web3.eth.getCoinbase();
  }

}
