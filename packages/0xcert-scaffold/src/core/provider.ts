import { Mutation } from "./context";
import { ValueLedgerBase } from "./value-ledger";
import { AssetLedgerBase } from "./asset-ledger";
import { OrderGatewayBase } from "./order-gateway";

/**
 * 
 */
export interface GenericProviderBase {
  sign(val: string): Promise<string>;
  getMutation(txId: string): Promise<Mutation>;
  getOrderGateway(id: string): Promise<OrderGatewayBase>;
  getAssetLedger(ledgerId): Promise<AssetLedgerBase>;
  getValueLedger(ledgerId): Promise<ValueLedgerBase>;
}
