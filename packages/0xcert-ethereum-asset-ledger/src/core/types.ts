/**
 * 
 */
export interface CreateAssetOptions {
  accountId: string;
  assetId: string;
  proof: string;
}

/**
 * 
 */
export interface UpdateAssetOptions {
  proof: string;
}

/**
 * 
 */
export interface UpdateOptions {
  uriBase: string;
}

/**
 * 
 */
export interface TransferAssetOptions {
  id: string;
  to: string;
  data?: string;
}
