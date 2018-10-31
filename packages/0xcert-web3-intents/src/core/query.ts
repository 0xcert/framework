import { parseError } from "./errors";
import { QueryBase } from "@0xcert/intents";

/**
 * 
 */
export class Query<T> implements QueryBase<T> {
  public result: T;

  /**
   * 
   */
  public async resolve(resolver: () => Promise<T>) {
    try {
      this.result = await resolver();
      return this;
    } catch (error) {
      throw parseError(error);
    }
  }

}
