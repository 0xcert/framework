import { Connector, SignatureKind } from './connector';
import { ConnectorError, ErrorKind } from '@0xcert/connector';

/**
 * Abstract class for generating claims.
 */
export abstract class Web3Claim {
  protected connector: Connector;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   */
  public constructor(connector: Connector) {
    this.connector = connector;
  }

  protected async createSignature(data, signatureKind, makerId) {
    try{
      if (signatureKind === SignatureKind.ETH_SIGN) {
        return `${signatureKind}:${await this.connector.web3.eth.sign(data, makerId)}`;
      } else if (signatureKind === SignatureKind.TREZOR) {
        return null;
      } else if (signatureKind === SignatureKind.EIP712) {
        return null;
      }
      
    } catch(error){
      throw new ConnectorError(ErrorKind.SIGNATURE, error);
    }
  }
}
