import { AssetLedgerDeployOrder, Gateway, OrderKind } from '@0xcert/ethereum-gateway';
import BigNumber from 'bignumber.js';
import { URLSearchParams } from 'url';
import { Client } from '../client';
import { ClientError } from '../helpers/client-error';
import clientFetch from '../helpers/client-fetch';
import { AssetLedgerDeploymentData, ClientErrorCode, GetDeploymentsOptions, Priority } from '../types';

/**
 * Deployments controller class with deployments related actions.
 */
export class DeploymentsController {

  /**
   * Client's context.
   */
  public context: Client;

  /**
   * Deployments controller class constructor.
   * @param context Client context instance.
   */
  public constructor(context: Client) {
    this.context = context;
  }

  /**
   * Returns paginated list of deployment.
   * @param pagination Listing pagination configuration.
   */
  public async getDeployments(options: GetDeploymentsOptions) {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    const params = new URLSearchParams({
      ...options.filterIds ? { filterIds: options.filterIds } : {},
      ...options.statuses ? { statuses: options.statuses.map((s) => s.toString()) } : {},
      ...options.sort ? { sort: options.sort.toString() } : {},
      ...options.skip ? { skip: options.skip.toString() } : { skip: this.context.defaultPagination.skip.toString() },
      ...options.limit ? { limit: options.limit.toString() } : { limit: this.context.defaultPagination.limit.toString() },
    });

    return clientFetch(`${this.context.apiUrl}/deployments?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Returns single deployment data.
   * @param deploymentRef Deployment reference.
   */
  public async getDeployment(deploymentRef: string) {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    return clientFetch(`${this.context.apiUrl}/deployments/${deploymentRef}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

  /**
   * Creates new asset ledger deploy order.
   * @param deployData Asset ledger deployment data.
   * @param priority Priority for this deploy to perform.
   */
  public async createDeployment(deployData: AssetLedgerDeploymentData, priority: Priority) {
    if (!this.context.authentication) {
      throw new ClientError(ClientErrorCode.CLIENT_NOT_CONNECTION);
    }

    const deployGateway = new Gateway(this.context.provider);
    const date = Date.now();
    const value = new BigNumber(this.context.payment.assetDeployCost);
    const assetLedgerDeployOrder = {
      kind: OrderKind.ASSET_LEDGER_DEPLOY_ORDER,
      makerId: this.context.provider.accountId,
      seed: date,
      expiration: Date.now() + 172800000, // 2 days
      tokenTransferData: {
        ledgerId: this.context.payment.tokenAddress,
        receiverId: this.context.payment.receiverAddress,
        value: value.toFixed(0),
      },
      assetLedgerData: deployData,
    };
    const claim = await deployGateway.sign(assetLedgerDeployOrder as AssetLedgerDeployOrder);
    delete assetLedgerDeployOrder.kind; // kind will be automatically assigned by the API

    return clientFetch(`${this.context.apiUrl}/deployments`, {
      method: 'POST',
      body: JSON.stringify({
        priority,
        claim,
        deploy: assetLedgerDeployOrder,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.context.authentication,
      },
    });
  }

}
