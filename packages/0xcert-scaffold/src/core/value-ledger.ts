/**
 * 
 */
export interface ValueLedgerBase {
  readonly id: string;
}

/**
 * 
 */
export interface ValueLedgerGetInfoResult {
  name: string;
  symbol: string;
  decimals: number;
}
