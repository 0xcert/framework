import { TransactionBase } from "./transaction-base";

/**
 * 
 */
export interface MutationBase {
  transaction: TransactionBase;
  resolve(resolver: (makerId: string) => Promise<any>): Promise<this>;
}
