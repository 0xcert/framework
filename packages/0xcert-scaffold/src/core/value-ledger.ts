import { MutationBase } from "./misc";

/**
 * Value ledger methods.
 */
export interface ValueLedgerBase {
  readonly id: string;
  getBalance(accountId: string): Promise<string>;
  getInfo(): Promise<ValueLedgerInfo>;
  approveValue(accountId: string, value: string): Promise<MutationBase>;
  disapproveValue(accountId: string): Promise<MutationBase>;
}

/**
 * Value ledger deploy data definition.
 */
export interface ValueLedgerDeployRecipe {
  name: string;
  symbol: string;
  decimals: string;
  supply: string;
}

/**
 * Value ledger information data definition.
 */
export interface ValueLedgerInfo {
  name: string;
  symbol: string;
  decimals: number;
  supply: string;
}

/**
 * Value transfer data definition.
 */
export interface ValueLedgerTransferRecipe {
  senderId?: string;
  receiverId: string;
  value: string;
}

