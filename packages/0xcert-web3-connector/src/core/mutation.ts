import { parseError } from "./errors";
import { Transaction } from "./transaction";
import { Context } from "./context";
import { MutationBase, MutationOptions } from "@0xcert/connector";

/**
 * 
 */
export class Mutation implements MutationBase {
  protected context: Context;
  protected options: MutationOptions;
  public transaction: Transaction;

  /**
   * 
   */
  public constructor(options: MutationOptions, context: Context) {
    this.options = { ...options };
    this.context = context;
  }

  /**
   * 
   */
  public async resolve(resolver: (makerId: string) => any) {
    try {
      const makerId = await this.findMakerId();
      const id = await new Promise((resolve, reject) => {
        resolver(makerId)
          .once('transactionHash', resolve)
          .once('error', reject);
      }) as string;
      this.transaction = new Transaction(id, this.context);
      return this;
    } catch (error) {
      throw parseError(error);
    }
  }

  /**
   * 
   */
  protected async findMakerId() {
    return this.options.makerId
      || this.context.makerId
      || await this.context.web3.eth.getAccounts().then((a) => a[0]);
  }

}
