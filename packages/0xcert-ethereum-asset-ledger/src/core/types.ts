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

/**
 * 
 */
export interface AssetLedgerDeployOptions {
  source: string;
  name: string;
  symbol: string;
  uriBase: string;
  conventionId: string;
}

/**
 * 
 */
export interface AssetObject {
  id: string;
  uri: string;
  proof: string;
}

/**
 * 
 */
export interface InfoObject {
  name: string;
  symbol: string;
  uriBase: string;
  conventionId: string;
}
