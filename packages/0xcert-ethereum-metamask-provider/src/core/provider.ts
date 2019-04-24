import { GenericProvider, ProviderEvent, SignMethod } from '@0xcert/ethereum-generic-provider';

/**
 * Metamask provider options interface.
 */
export interface MetamaskProviderOptions {

  /**
   * Type of signature that will be used in making claims etc.
   */
  signMethod?: SignMethod;

  /**
   * List of addresses where normal transfer not safeTransfer smart contract methods will be used.
   */
  unsafeRecipientIds?: string[];

  /**
   * Source where assetLedger compiled smart contract is located.
   */
  assetLedgerSource?: string;

  /**
   * Source where valueLedger compiled smart contract is located.
   */
  valueLedgerSource?: string;

  /**
   * Number of confirmations (blocks in blockchain after mutation is accepted) are necessary to mark a mutation complete.
   */
  requiredConfirmations?: number;

  /**
   * Id (address) of order gateway.
   */
  orderGatewayId?: string;

  /**
   * The number of milliseconds in which a mutation times out.
   */
  mutationTimeout?: number;
}

/**
 * Metamask RPC client.
 */
export class MetamaskProvider extends GenericProvider {

  /**
   * Current network version.
   */
  protected _networkVersion: string;

  /**
   * Gets an instance of metamask provider.
   */
  public static getInstance(): MetamaskProvider {
    return new this();
  }

  /**
   * Class constructor.
   */
  public constructor(options?: MetamaskProviderOptions) {
    super({
      ...options,
      signMethod: SignMethod.PERSONAL_SIGN,
    });

    if (this.isSupported()) {
      this.installClient();
      this.installEvents();
    }
  }

  /**
   * Checks if metamask is available.
   */
  public isSupported() {
    if (typeof window === 'undefined') {
      return false;
    }

    if (typeof window['ethereum'] !== 'undefined') {
      return (
        window['ethereum'].isMetaMask
      );
    } else if (typeof window['web3'] !== 'undefined') {
      return (
        typeof window['web3']['currentProvider'] !== 'undefined'
        && window['web3']['currentProvider'].isMetaMask
      );
    } else {
      return false;
    }
  }

  /**
   * Checks if metamask is enabled.
   */
  public async isEnabled() {
    if (!this.isSupported() || !this.accountId) {
      return false;
    }

    if (typeof window['ethereum'] !== 'undefined') {
      return this._client._metamask.isApproved();
    } else {
      return typeof window['web3'] !== 'undefined';
    }
  }

  /**
   * Enables metamask.
   */
  public async enable() {
    if (!this.isSupported()) {
      return false;
    }

    this.accountId = typeof window['ethereum'] !== 'undefined'
      ? await this._client.enable().then((a) => a[0])
      : window['web3']['eth']['coinbase'];

    return this;
  }

  /**
   * Initializes metamask client.
   */
  protected async installClient() {
    if (typeof window['ethereum'] !== 'undefined') { // v2 (latest)
      this._client = window['ethereum'];
    } else { // v1 (web3 based)
      this._client = {
        ...window['web3']['currentProvider'],
        send(payload, callback) {
          if (['eth_accounts', 'eth_coinbase', 'net_version'].indexOf(payload.method) !== -1) {
            callback(null, window['web3']['currentProvider'].send(payload));
          } else {
            window['web3']['currentProvider'].sendAsync(payload, callback);
          }
        },
      };
    }
  }

  /**
   * Initializes metamask events.
   */
  protected async installEvents() {

    const networkVersion = await this.getNetworkVersion();
    if (networkVersion !== this._networkVersion) {
      this.emit(ProviderEvent.NETWORK_CHANGE, networkVersion, this._networkVersion);
      this._networkVersion = networkVersion;
    }

    this.accountId = await this.getAvailableAccounts().then((a) => a[0]);

    setTimeout(() => this.installEvents(), 1000);
  }

}
