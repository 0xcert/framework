import { FolderTransfer } from "./folder";
import { VaultTransfer } from "./vault";

/**
 * 
 */
export interface MinterBase {
  perform(deal);
  cancel(deal);
}

/**
 * 
 */
export interface MinterDealBase extends MinterDealData {
  populate(data: MinterDealDataInput): this;
  serialize(): MinterDealData;
  build(recipe: MinterDealRecipeInput): this;
  sign(): this;
}

/**
 * 
 */
export interface MinterDealData {
  claim: string;
  signature: string;
  recipe: MinterDealRecipe;
}

/**
 * 
 */
export interface MinterDealDataInput {
  claim?: string;
  signature?: string;
  recipe?: MinterDealRecipeInput;
}

/**
 * 
 */
export interface MinterDealRecipe {
  makerId: string;
  takerId: string;
  asset: {
    folderId: string;
    assetId: string;
    proof: string;
  },
  transfers: (FolderTransfer | VaultTransfer)[];
  seed: number;
  expiration: number;
}

/**
 * 
 */
export interface MinterDealRecipeInput {
  makerId?: string;
  takerId: string;
  asset: {
    folderId: string;
    assetId: string;
    proof?: string;
  },
  transfers?: (FolderTransfer | VaultTransfer)[];
  seed?: number;
  expiration?: number;
}
