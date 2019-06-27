import { GenericProvider, Mutation, SignMethod } from '@0xcert/ethereum-generic-provider';
import { Deploy, DeployGatewayBase } from '@0xcert/scaffold';
import { normalizeDeployIds } from '../lib/deploy';
import cancel from '../mutations/cancel';
import perform from '../mutations/perform';
import claimEthSign from '../queries/claim-eth-sign';
import claimPersonalSign from '../queries/claim-personal-sign';
import getDeployDataClaim from '../queries/get-deploy-data-claim';
import getTokenTransferProxyId from '../queries/get-token-transfer-proxy-id';
import isValidSignature from '../queries/is-valid-signature';

/**
 * Ethereum deploy gateway implementation.
 */
export class DeployGateway implements DeployGatewayBase {

  /**
   * Address of the smart contract that represents this deploy gateway.
   */
  protected _id: string;

  /**
   * Provider instance.
   */
  protected _provider: GenericProvider;

  /**
   * Gets an instance of deploy gateway.
   * @param provider  Provider class with which we comunicate with blockchain.
   * @param id Address of the deploy gateway smart contract.
   */
  public static getInstance(provider: GenericProvider, id?: string): DeployGateway {
    return new this(provider, id);
  }

  /**
   * Initialize deploy gateway.
   * @param provider  Provider class with which we comunicate with blockchain.
   * @param id Address of the deploy gateway smart contract.
   */
  public constructor(provider: GenericProvider, id?: string) {
    this._provider = provider;
    this._id = this._provider.encoder.normalizeAddress(id); // TODO: || provider.deployGatewayId
  }

  /**
   * Gets the address of the smart contract that represents this deploy gateway.
   */
  public get id() {
    return this._id;
  }

  /**
   * Gets the provider that is used to comunicate with blockchain.
   */
  public get provider() {
    return this._provider;
  }

  /**
   * Gets signed claim for an deploy.
   * @param deploy Deploy data.
   */
  public async claim(deploy: Deploy): Promise<string> {
    deploy = normalizeDeployIds(deploy, this._provider);

    if (this._provider.signMethod == SignMethod.PERSONAL_SIGN) {
      return claimPersonalSign(this, deploy);
    } else {
      return claimEthSign(this, deploy);
    }
  }

  /**
   * Performs an deploy.
   * @param deploy Deploy data.
   * @param claim Claim data.
   */
  public async perform(deploy: Deploy, claim: string): Promise<Mutation> {
    deploy = normalizeDeployIds(deploy, this._provider);

    return perform(this, deploy, claim);
  }

  /**
   * Cancels an deploy.
   * @param deploy Deploy data.
   */
  public async cancel(deploy: Deploy): Promise<Mutation> {
    deploy = normalizeDeployIds(deploy, this._provider);

    return cancel(this, deploy);
  }

  /**
   * Gets token transfer proxy address.
   */
  public async getTokenTransferProxyId() {
    return getTokenTransferProxyId(this);
  }

  /**
   * Checks if claim for this deploy is valid.
   * @param deploy Deploy data.
   * @param claim Claim data.
   */
  public async isValidSignature(deploy: Deploy, claim: string) {
    deploy = normalizeDeployIds(deploy, this._provider);

    return isValidSignature(this, deploy, claim);
  }

  /**
   * Generates hash from deploy.
   * @param deploy Deploy data.
   */
  public async getDeployDataClaim(deploy: Deploy) {
    deploy = normalizeDeployIds(deploy, this._provider);
    return getDeployDataClaim(this, deploy);
  }

}
