import { ConnectorError, ConnectorIssue } from '@0xcert/connector';
import { parseError } from '@0xcert/web3-errors';

/**
 * 
 */
export enum SignatureMethod {
  ETH_SIGN = 0,
  TREZOR = 1,
  EIP712 = 2,
}

/**
 * 
 */
export interface SignatureConfig {
  web3: any;
  data: any;
  makerId: string;
}

/**
 * 
 */
export class Signature {
  protected config: SignatureConfig;

  /**
   * 
   */
  public constructor(config: SignatureConfig) {
    this.config = config;
  }

  /**
   * 
   */
  public async sign(method: SignatureMethod) {
    try {
      switch (method) {
        case SignatureMethod.ETH_SIGN:
          return this.signWithEthSign();
        case SignatureMethod.TREZOR:
          return this.signWithTrezor();
        case SignatureMethod.EIP712:
          return this.signWithEIP712();
        default:
          throw new ConnectorError(ConnectorIssue.SIGNATURE_FAILED, method);
      }
    } catch(error) {
      throw parseError(error);
    }
  }

  /**
   * 
   */
  protected async signWithEthSign() {
    const method = SignatureMethod.ETH_SIGN;
    const signature = await this.config.web3.eth.sign(this.config.data, this.config.makerId);

    return `${method}:${signature}`;
  }

  /**
   * 
   */
  protected async signWithTrezor() {
    const method = SignatureMethod.TREZOR;
    const signature = '';
    
    return `${method}:${signature}`;
  }

  /**
   * 
   */
  protected async signWithEIP712() {
    const method = SignatureMethod.EIP712;
    const signature = '';
    
    return `${method}:${signature}`;
  }

}
