import { parseError } from "./errors";
import { Transaction } from "./transaction";
import { MutationBase } from "@0xcert/intents";

/**
 * 
 */
export interface MutationConfig {
  web3: any;
  confirmations?: number;
}

/**
 * 
 */
export class Mutation implements MutationBase {
  public transaction: Transaction;
  protected config: MutationConfig;

  /**
   * 
   */
  public constructor(config: MutationConfig) {
    this.config = { ...config };
  }

  /**
   * 
   */
  public async resolve(resolver: () => any) {
    try {
      const id = await new Promise((resolve, reject) => {
        resolver()
          .once('transactionHash', resolve)
          .once('error', reject);
      }) as string;
      this.transaction = new Transaction({ id, ...this.config });
      return this;
    } catch (error) {
      throw parseError(error);
    }
  }

}
