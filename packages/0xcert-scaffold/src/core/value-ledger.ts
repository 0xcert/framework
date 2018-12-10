import { MutationBase } from "./misc";

/**
 * 
 */
export interface ValueLedgerBase {
  readonly id: string;
  getBalance(accountId: string): Promise<string>;
  getInfo(): Promise<ValueLedgerInfo>;
  approveValue(accountId: string, value: string): Promise<MutationBase>;
  disapproveValue(accountId: string): Promise<MutationBase>;
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

/**
 * 
 */
export interface ValueLedgerTransferRecipe {
  senderId?: string;
  receiverId: string;
  value: string;
}

