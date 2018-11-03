import { Mutation } from "./connector";
import { FolderTransfer } from "./folder";
import { VaultTransfer } from "./vault";

/**
 * 
 */
export interface ExchangeBase {
  perform(order): Promise<Mutation>;
  cancel(order): Promise<Mutation>;
}

/**
 * 
 */
export interface ExchangeOrderBase extends ExchangeOrderData {
  populate(data: ExchangeOrderDataInput): this;
  serialize(): ExchangeOrderData;
  build(recipe: ExchangeOrderRecipeInput): this;
  sign(): this;
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
  transfers: (FolderTransfer | VaultTransfer)[];
  seed: number;
  expiration: number;
}

/**
 * 
 */
export interface ExchangeOrderRecipeInput {
  makerId?: string;
  takerId: string;
  transfers?: (FolderTransfer | VaultTransfer)[];
  seed?: number;
  expiration?: number;
}
