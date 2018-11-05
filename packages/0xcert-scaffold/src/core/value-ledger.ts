import { Query, ContextBase } from "./context";

/**
 * 
 */
export interface ValueLedgerBase {
  readonly platform: string;
  readonly context: ContextBase;
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

/**
 * 
 */
export interface ValueLedgerTransfer {
  ledgerId: string;
  senderId: string;
  receiverId: string;
  amount: number;
}
