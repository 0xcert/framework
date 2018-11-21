import { Query, ContextBase } from "./context";

/**
 * 
 */
export interface ValueLedgerBase {
  readonly id: string;
  getInfo(): Promise<Query<ValueLedgerGetInfoResult>>;
  getSupply(): Promise<Query<number>>;
}

/**
 * 
 */
export interface ValueLedgerGetInfoResult {
  name: string;
  symbol: string;
  decimals: number;
}
