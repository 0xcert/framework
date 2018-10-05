import * as Web3 from 'web3';
import { Folder } from './folder';

/**
 *
 */
export interface Web3ProviderConfig {
  web3Provider?: string;
  xcertMintProxyAddress?: string;
  tokenTransferProxyAddress?: string;
  nftokenTransferProxyAddress?: string;
  exchangeAddress?: string;
  minterAddress?: string;
}

/**
 *
 */
export class Web3Provider {
  protected config: Web3ProviderConfig;
  protected web3: Web3;

  /**
   * 
   * @param address Existing contract address.
   */
  public constructor(config?: Web3ProviderConfig) {
    this.config = { ...config };
    this.web3 = new Web3(this.config.web3Provider);
  }

  /**
   * 
   * @param address Existing Xcert contract address.
   */
  public createFolder(address?: string) {
    return new Folder({
      web3: this.web3,
      address,
    });
  }

}