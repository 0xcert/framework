import { isUndefined } from '@0xcert/utils';

/**
 * 
 */
export interface ContextConfig {
  web3: any;
  confirmations?: number;
  makerId?: string;
}

/**
 * 
 */
export class Context {
  readonly web3: any;
  readonly confirmations: number;
  readonly makerId: string;

  /**
   * 
   */
  public constructor(config: ContextConfig) {
    this.web3 = config.web3;
    this.confirmations = !isUndefined(config.confirmations) ? config.confirmations : 25;
    this.makerId = config.makerId;
  }
}
