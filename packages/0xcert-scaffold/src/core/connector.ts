import { Mutation } from "./context";
import { ValueLedgerBase } from "./value-ledger";
import { AssetLedgerBase } from "./asset-ledger";
import { OrderExchangeBase } from "./order-exchange";

/**
 * 
 */
export interface ConnectorBase {
  sign(val: string): Promise<string>;
  getMutation(txId: string): Promise<Mutation>;
  getOrderExchange(id: string): Promise<OrderExchangeBase>;
  getAssetLedger(ledgerId): Promise<AssetLedgerBase>;
  getValueLedger(ledgerId): Promise<ValueLedgerBase>;
}
