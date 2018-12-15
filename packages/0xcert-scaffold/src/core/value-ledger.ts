import { MutationBase } from "./misc";
import { OrderGatewayBase } from "./order-gateway";

/**
 * 
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
 * 
 */
export interface ValueLedgerDeployRecipe {
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

