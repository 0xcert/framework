import { Query } from "./connector";

/**
 * 
 */
export interface VaultBase {
  getInfo(): Promise<Query<VaultGetInfoResult>>;
  getSupply(): Promise<Query<number>>;
}

/**
 * 
 */
export interface VaultGetInfoResult {
  name: string;
  symbol: string;
  decimals: number;
}

/**
 * 
 */
export interface VaultTransfer {
  vaultId: string;
  senderId: string;
  receiverId: string;
  amount: number;
}
