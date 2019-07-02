import { AssetLedgerCapability } from './asset-ledger';
import { MutationBase } from './mutation';

/**
 * Deploy gateway method definition.
 */
export interface DeployGatewayBase {

  /**
   * Address of the smart contract that represents this deploy gateway.
   */
  readonly id: string;

  /**
   * Gets signed claim for an deploy.
   * @param order Deploy data.
   */
  claim(deploy: Deploy): Promise<string>;

  /**
   * Performs an deploy.
   * @param order Deploy data.
   * @param claim Claim data.
   */
  perform(deploy: Deploy, claim: string): Promise<MutationBase>;

  /**
   * Cancels an deploy.
   * @param deploy Deploy data.
   */
  cancel(deploy: Deploy): Promise<MutationBase>;
}

/**
 * Asset ledger deploy data definition.
 */
export interface AssetLedgerData {

  /**
   * Asset Ledger name.
   */
  name: string;

  /**
   * Asset Ledger symbol/ticker.
   */
  symbol: string;

  /**
   * Uri base for metadata URI-s. At the end of the base the assetId is automatically appended foo each asset.
   * Example: https://example.com/id/
   * Asset 1 URI will become: https://example.com/id/1
   */
  uriBase: string;

  /**
   * Hashed representation of JSON schema defining this object.
   */
  schemaId: string;

  /**
   * Array representing capabilities.
   */
  capabilities?: AssetLedgerCapability[];

  /**
   * Id (address) of the owner of this asset ledger.
   */
  owner: string;
}

/**
 * Token transfer data definition.
 */
export interface TokenTransferData {

  /**
   * Id (address) of the smart contract that represents the assetLedger.
   */
  ledgerId: string;

  /**
   * Id (address) of the receiver.
   */
  receiverId?: string;

  /**
   * The amount of value(erc20 tokens).
   */
  value: string; // TODO BN.js

}

/**
 * Deploy definition.
 */
export class Deploy {

  /**
   * Address of the order maker.
   */
  public makerId: string;

  /**
   * Address of the order taker.
   */
  public takerId?: string;

  /**
   * Data from which a new asset ledger will be created.
   */
  public assetLedgerData: AssetLedgerData;

  /**
   * Data defining a fungible token transfer.
   */
  public tokenTransferData: TokenTransferData;

  /**
   * Nonce for hash generation - usually current timestamp.
   */
  public seed: number;

  /**
   * Timestamp of order expiration.
   */
  public expiration: number;
}
