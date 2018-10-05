import * as Web3 from 'web3';
import * as env from '../config/env';

/**
 * 
 */
export interface FolderConfig {
  web3: Web3;
  address?: string;
}

/**
 * 
 */
export class Folder {
  protected config: FolderConfig;
  protected instance: any;

  /**
   * 
   */
  public constructor(config: FolderConfig) {
    this.config = config;
    this.instance = new this.config.web3.eth.Contract(env.xcertAbi, config.address);
  }

  /**
   * 
   */
  public async getName() {
    return this.instance.methods.name().call();
  }

  /**
   * 
   */
  public async getSymbol() {
    return this.instance.methods.symbol().call();
  }

  /**
   * 
   */
  public async getConvention() {
    return this.instance.methods.conventionId().call();
  }

  /**
   * 
   */
  public async getSupply() {
    return this.instance.methods.totalSupply().call();
  }

}