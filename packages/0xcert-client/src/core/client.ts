import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import { sha } from '@0xcert/utils';
import { AccountsController } from './controllers/accounts-controller';
import { DeploymentsController } from './controllers/deployments-controller';
import { LedgersController } from './controllers/ledgers-controller';
import { OrdersController } from './controllers/orders-controller';
import { RequestsController } from './controllers/requests-controller';
import { StatsController } from './controllers/stats-controller';
import { ClientError } from './helpers/client-error';
import clientFetch from './helpers/client-fetch';
import { AccountInformation, ActionsOrder, AssetLedgerDeploymentData, ClientErrorCode,
  ClientOptions, DefaultListingOptions, GetDeploymentsOptions,
  GetLedgersAbilitiesOptions, GetLedgersAccountsOptions, GetLedgersAssetsOptions, GetLedgersOptions,
  GetOrdersOptions, GetRequestsOptions, GetStatsTickersOptions, GetStatsTrafficOptions, Payment, Priority, WebhookEventKind } from './types';

/**
 * Client class.
 */
export class Client {

  /**
   * Instance of 0xcert framework provider that will be used for message signing.
   */
  public provider: GenericProvider;

  /**
   * API url.
   */
  public apiUrl: string;

  /**
   * Account's payment information.
   */
  public payment: Payment = {
    tokenAddress: null,
    receiverAddress: null,
    valueTransferCost: null,
    assetTransferCost: null,
    assetCreateCost: null,
    assetDeployCost: null,
    setAbilitiesCost: null,
    assetRevokeCost: null,
    assetUpdateCost: null,
    assetDestroyCost: null,
  };

  /**
   * Authentication string. Is set on client initialization.
   */
  public authentication: string;

  /**
   * Accounts controller class instance.
   */
  protected accountsController: AccountsController;

  /**
   * Deployments controller class instance.
   */
  protected deploymentsController: DeploymentsController;

  /**
   * Orders controller class instance.
   */
  protected ordersController: OrdersController;

  /**
   * Ledgers controller class instance.
   */
  protected ledgersController: LedgersController;

  /**
   * Stats controller class instance.
   */
  protected statsController: StatsController;

  /**
   * Requests controller class instance.
   */
  protected requestsController: RequestsController;

  /**
   * Default pagination configuration.
   */
  public defaultPagination: DefaultListingOptions = {
    skip: 0,
    limit: 35,
  };

  /**
   * Class constructor.
   * @param options.provider Provider for connection to the blockchain.
   * @param options.apiUrl Url of API. Defaults to https://api.0xcert.org.
   */
  public constructor(options: ClientOptions) {
    this.provider = options.provider;
    this.apiUrl = typeof options.apiUrl !== 'undefined' ? options.apiUrl : 'https://api.0xcert.org';
  }

  /**
   * Initializes client and gets authenticated account's data.
   */
  public async init() {
    let msg = 'I accept 0xcert terms of use.';
    if (this.provider.signMethod === SignMethod.ETH_SIGN) {
      msg = `0x${await sha(256, msg)}`;
    }
    const signature = await this.provider.sign(msg);
    const signatureType = this.provider.signMethod;
    this.authentication = `${signatureType}:${signature}`;

    let data = null;
    try {
      const accountData = await clientFetch(`${this.apiUrl}/account`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authentication,
        },
      });
      data = accountData.data;
    } catch (error) {
      throw new ClientError(ClientErrorCode.CLIENT_INITIALIZATION_FAILED, error);
    }

    if (!(data && data.id && data.payment)) {
      throw new ClientError(ClientErrorCode.CLIENT_INITIALIZATION_FAILED);
    }

    this.payment.tokenAddress = data.payment.tokenAddress;
    this.payment.receiverAddress = data.payment.receiverAddress;
    this.payment.valueTransferCost = data.payment.valueTransferCost;
    this.payment.assetTransferCost = data.payment.assetTransferCost;
    this.payment.assetCreateCost = data.payment.assetCreateCost;
    this.payment.assetDeployCost = data.payment.assetDeployCost;
    this.payment.setAbilitiesCost = data.payment.setAbilitiesCost;
    this.payment.assetRevokeCost = data.payment.assetRevokeCost;
    this.payment.assetUpdateCost = data.payment.assetUpdateCost;
    this.payment.assetDestroyCost = data.payment.assetDestroyCost;

    this.accountsController = new AccountsController(this);
    this.deploymentsController = new DeploymentsController(this);
    this.ordersController = new OrdersController(this);
    this.ledgersController = new LedgersController(this);
    this.statsController = new StatsController(this);
    this.requestsController = new RequestsController(this);

  }

  /**
   * Returns currently authenticated account's information.
   */
  public async getAccount() {
    return this.accountsController.getAccount();
  }

  /**
   * Returns list of currently authenticated account's ledger abilities.
   */
  public async getAccountAbilities() {
    return this.accountsController.getAccountAbilities();
  }

  /**
   * Returns currently authenticated account's webhook.
   */
  public async getAccountWebhook() {
    return this.accountsController.getAccountWebhook();
  }

  /**
   * Updates currently authenticated account's webhook.
   * @param url Webhook url.
   * @param events List of webhook event.
   */
  public async updateAccountWebhook(url: string, events: WebhookEventKind[]) {
    return this.accountsController.updateAccountWebhook(url, events);
  }

  /**
   * Updates currently authenticated account's information.
   * @param accountInformation Account's information.
   */
  public async updateAccountInformation(accountInformation: AccountInformation) {
    return this.accountsController.updateAccountInformation(accountInformation);
  }

  /**
   * Returns currently authenticated account's deployments.
   * @param options Query listing options.
   */
  public async getDeployments(options: GetDeploymentsOptions = {}) {
    return this.deploymentsController.getDeployments(options);
  }

  /**
   * Returns currently authenticated account's deployment by deploymentRef.
   * @param deploymentRef Deployment reference.
   */
  public async getDeployment(deploymentRef: string) {
    return this.deploymentsController.getDeployment(deploymentRef);
  }

  /**
   * Creates new deployment.
   * @param deployData Asset ledger deploy data.
   * @param priority Priority.
   */
  public async createDeployment(deployData: AssetLedgerDeploymentData, priority: Priority) {
    return this.deploymentsController.createDeployment(deployData, priority);
  }

  /**
   * Returns currently authenticated account's orders.
   * @param options Query listing options.
   */
  public async getOrders(options: GetOrdersOptions = {}) {
    return this.ordersController.getOrders(options);
  }

  /**
   * Returns currently authenticated account's order by orderRef.
   * @param orderRef Order reference.
   */
  public async getOrder(orderRef: string) {
    return this.ordersController.getOrder(orderRef);
  }

  /**
   * Creates new action order.
   * @param order Actions order.
   * @param priority Priority.
   */
  public async createOrder(order: ActionsOrder, priority: Priority) {
    return this.ordersController.createOrder(order, priority);
  }

  /**
   * Signs existing order.
   * @param orderRef Order reference.
   */
  public async signOrder(orderRef: string) {
    return this.ordersController.signOrder(orderRef);
  }

  /**
   * Performs existing order.
   * @param orderRef Order reference.
   */
  public async performOrder(orderRef: string) {
    return this.ordersController.performOrder(orderRef);
  }

  /**
   * Cancels existing order.
   * @param orderRef Order reference.
   */
  public async cancelOrder(orderRef: string) {
    return this.ordersController.cancelOrder(orderRef);
  }

  /**
   * Returns existing ledger.
   * @param ledgerRef Ledger reference.
   */
  public async getLedger(ledgerRef: string) {
    return this.ledgersController.getLedger(ledgerRef);
  }

  /**
   * Returns list of ledgers.
   * @param options Query listing options.
   */
  public async getLedgers(options: GetLedgersOptions = {}) {
    return this.ledgersController.getLedgers(options);
  }

  /**
   * Returns existing ledger's abilities.
   * @param ledgerRef Ledger reference.
   * @param options Query listing options.
   */
  public async getLedgerAbilities(ledgerRef: string, options: GetLedgersAbilitiesOptions = {}) {
    return this.ledgersController.getLedgerAbilities(ledgerRef, options);
  }

  /**
   * Returns existing ledger's accounts.
   * @param ledgerRef Ledger reference.
   * @param options Query listing options.
   */
  public async getLedgerAccounts(ledgerRef: string, options: GetLedgersAccountsOptions = {}) {
    return this.ledgersController.getLedgerAccounts(ledgerRef, options);
  }

  /**
   * Returns existing ledger's assets.
   * @param ledgerRef Ledger reference.
   * @param options Query listing options.
   */
  public async getLedgerAssets(ledgerRef: string, options: GetLedgersAssetsOptions = {}) {
    return this.ledgersController.getLedgerAssets(ledgerRef, options);
  }

  /**
   * Returns existing ledger's asset.
   * @param ledgerRef Ledger reference.
   * @param assetId Asset ID.
   */
  public async getLedgerAsset(ledgerRef: string, assetId: string) {
    return this.ledgersController.getLedgerAsset(ledgerRef, assetId);
  }

  /**
   * Returns currently authenticated account's traffic stats.
   * @param options Query listing options.
   */
  public async getTrafficStats(options: GetStatsTrafficOptions = {}) {
    return this.statsController.getTrafficStats(options);
  }

  /**
   * Returns currently authenticated account's costs stats.
   * @param options Query listing options.
   */
  public async getCostsStats(options: GetStatsTrafficOptions = {}) {
    return this.statsController.getCostStats(options);
  }

  /**
   * Returns information about ZXC price.
   * @param options Query listing options.
   */
  public async getTickerStats(options: GetStatsTickersOptions = {}) {
    return this.statsController.getTickerStats(options);
  }

  /**
   * Returns currently authenticated account's list of requests.
   * @param options Query listing options.
   */
  public async getRequests(options: GetRequestsOptions = {}) {
    return this.requestsController.getRequests(options);
  }

  /**
   * Returns existing request.
   * @param requestRef Request reference.
   */
  public async getRequest(requestRef: string) {
    return this.requestsController.getRequest(requestRef);
  }

}
