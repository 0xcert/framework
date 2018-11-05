import { Mutation, ContextBase } from "./context";
import { AssetLedgerTransfer } from "./asset-ledger";
import { ValueLedgerTransfer } from "./value-ledger";

/**
 * 
 */
export interface ExchangeBase {
  readonly platform: string;
  readonly context: ContextBase;
  perform(order): Promise<Mutation>;
  cancel(order): Promise<Mutation>;
}

/**
 * 
 */
export interface ExchangeOrderBase extends ExchangeOrderData {
  readonly platform: string;
  readonly context: ContextBase;
  populate(data: ExchangeOrderDataInput): this;
  serialize(): ExchangeOrderData;
  build(recipe: ExchangeOrderRecipeInput): Promise<this>;
  sign(): Promise<this>;
}

/**
 * 
 */
export interface ExchangeOrderData {
  claim: string;
  signature: string;
  recipe: ExchangeOrderRecipe;
}

/**
 * 
 */
export interface ExchangeOrderDataInput {
  claim?: string;
  signature?: string;
  recipe?: ExchangeOrderRecipeInput;
}

/**
 * 
 */
export interface ExchangeOrderRecipe {
  makerId: string;
  takerId: string;
  transfers: (AssetLedgerTransfer | ValueLedgerTransfer)[];
  seed: number;
  expiration: number;
}

/**
 * 
 */
export interface ExchangeOrderRecipeInput {
  makerId?: string;
  takerId: string;
  transfers?: (AssetLedgerTransfer | ValueLedgerTransfer)[];
  seed?: number;
  expiration?: number;
}
