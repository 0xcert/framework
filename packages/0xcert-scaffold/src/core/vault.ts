import { Query } from "./context";

/**
 * 
 */
export interface VaultBase {
  readonly platform: string;
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
