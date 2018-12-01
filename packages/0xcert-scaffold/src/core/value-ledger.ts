import { Mutation } from "./misc";

/**
 * 
 */
export interface ValueLedgerBase {
  readonly id: string;
  getBalance(accountId: string): Promise<string>;
  getInfo(): Promise<ValueLedgerInfo>;
  approveAccount(accountId: string, value: string): Promise<Mutation>;
}

/**
 * 
 */
export interface ValueLedgerDeployRecipe {
  source: string;
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
}

/**
 * 
 */
export interface ValueLedgerInfo {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
}
