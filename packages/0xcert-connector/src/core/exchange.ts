import { FolderTransfer } from "./folder";
import { VaultTransfer } from "./vault";

/**
 * 
 */
export interface ExchangeBase {
  perform(deal);
  cancel(deal);
}

/**
 * 
 */
export interface ExchangeDealBase extends ExchangeDealData {
  populate(data: ExchangeDealDataInput): this;
  serialize(): ExchangeDealData;
  build(recipe: ExchangeDealRecipeInput): this;
  sign(): this;
}

/**
 * 
 */
export interface ExchangeDealData {
  claim: string;
  signature: string;
  recipe: ExchangeDealRecipe;
}

/**
 * 
 */
export interface ExchangeDealDataInput {
  claim?: string;
  signature?: string;
  recipe?: ExchangeDealRecipeInput;
}

/**
 * 
 */
export interface ExchangeDealRecipe {
  makerId: string;
  takerId: string;
  transfers: (FolderTransfer | VaultTransfer)[];
  seed: number;
  expiration: number;
}

/**
 * 
 */
export interface ExchangeDealRecipeInput {
  makerId?: string;
  takerId: string;
  transfers?: (FolderTransfer | VaultTransfer)[];
  seed?: number;
  expiration?: number;
}
