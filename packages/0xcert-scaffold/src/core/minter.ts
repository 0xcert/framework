import { Mutation } from "./context";
import { AssetLedgerTransfer } from "./asset-ledger";
import { VaultTransfer } from "./vault";

/**
 * 
 */
export interface MinterBase {
  readonly platform: string;
  perform(order): Promise<Mutation>;
  cancel(order): Promise<Mutation>;
}

/**
 * 
 */
export interface MinterOrderBase extends MinterOrderData {
  populate(data: MinterOrderDataInput): this;
  serialize(): MinterOrderData;
  build(recipe: MinterOrderRecipeInput): Promise<this>;
  sign(): Promise<this>;
}

/**
 * 
 */
export interface MinterOrderData {
  claim: string;
  signature: string;
  recipe: MinterOrderRecipe;
}

/**
 * 
 */
export interface MinterOrderDataInput {
  claim?: string;
  signature?: string;
  recipe?: MinterOrderRecipeInput;
}

/**
 * 
 */
export interface MinterOrderRecipe {
  makerId: string;
  takerId: string;
  asset: {
    ledgerId: string;
    assetId: string;
    proof: string;
  },
  transfers: (AssetLedgerTransfer | VaultTransfer)[];
  seed: number;
  expiration: number;
}

/**
 * 
 */
export interface MinterOrderRecipeInput {
  makerId?: string;
  takerId: string;
  asset: {
    ledgerId: string;
    assetId: string;
    proof?: string;
  },
  transfers?: (AssetLedgerTransfer | VaultTransfer)[];
  seed?: number;
  expiration?: number;
}
