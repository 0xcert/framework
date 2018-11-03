import { ConnectorBase } from "@0xcert/connector";
import { SignatureMethod } from "@0xcert/web3-utils";
import { Folder } from "@0xcert/web3-folder";

/**
 * 
 */
export interface ConnectorConfig {
  web3: any;
  signatureMethod?: SignatureMethod;
  makerId?: string;
  minterId?: string;
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
    this.config = {
      signatureMethod: SignatureMethod.ETH_SIGN,
      makerId: null, //
      minterId: '',
      web3: config.web3,
    };
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
  protected async getMakerId() {
    return this.config.makerId || await this.config.web3.eth.getCoinbase();
  }

}
