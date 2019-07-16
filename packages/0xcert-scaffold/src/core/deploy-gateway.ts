import { AssetLedgerData, TokenTransferData } from './gateway';
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
