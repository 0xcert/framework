import { ConnectorError, ConnectorIssue } from '@0xcert/scaffold';
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
  method: SignatureMethod
  makerId: string;
}

/**
 * 
 */
export async function createSignature(data: string, config: Connector) {
  try {
    switch (config.method) {
      case SignatureMethod.ETH_SIGN:
        return await this.config.web3.eth.sign(data, config.makerId);
      case SignatureMethod.TREZOR:
        return null;
      case SignatureMethod.EIP712:
        return null;
      default:
        throw new ConnectorError(ConnectorIssue.SIGNATURE_FAILED, `Unknown signature ${config.method}`);
    }
  } catch(error) {
    throw parseError(error);
  }
}
