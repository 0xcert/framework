import { MutationBase } from "./misc";
import { OrderGatewayBase } from "./order-gateway";

/**
 * Value ledger methods.
 */
export interface ValueLedgerBase {
  readonly id: string;
  approveValue(accountId: string | OrderGatewayBase, value: string): Promise<MutationBase>;
  disapproveValue(accountId: string | OrderGatewayBase): Promise<MutationBase>;
  getApprovedValue(accountId: string, spenderId: string): Promise<String>;
  getBalance(accountId: string): Promise<string>;
  getInfo(): Promise<ValueLedgerInfo>;
  isApprovedValue(accountId: string, spenderId: string, value: string): Promise<Boolean>;
  transferValue(data: ValueLedgerTransferRecipe): Promise<MutationBase>;    
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

