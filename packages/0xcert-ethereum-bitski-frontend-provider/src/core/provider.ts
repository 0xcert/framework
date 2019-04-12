import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';

/**
 * Configuration interface for generic provider.
 */
export interface BitskiProviderOptions {

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
   * Number of confirmations (blocks in blockchain after mutation is accepted) that are necessary to mark a mutation complete.
   */
  requiredConfirmations?: number;

  /**
   * ID (address) of order gateway.
   */
  orderGatewayId?: string;

  /**
   * The number of milliseconds in which a mutation times out.
   */
  mutationTimeout?: number;

  /**
   * Bitski client ID.
   */
  clientId: string;

  /**
   * Bitski redirect url.
   */
  redirectUrl: string;

  /**
   * Ethereum network Bitski is connected to. Mainnet by default.
   */
  networkName?: string;
}

/**
 * Bitski RPC client.
 */
export class BitskiProvider extends GenericProvider {

  /**
   * Default options set from constructor.
   */
  protected _options: BitskiProviderOptions;

  /**
   * Bitski instance.
   */
  protected _bitski: any;

  /**
   * Bitski provider instance.
   */
  protected _provider: any;

  /**
   * Handles sign out.
   */
  private signOutHandler: any;

  /**
   * Returns a new provider instance.
   * @param options HTTP provider options.
   */
  public static getInstance(options: BitskiProviderOptions): BitskiProvider {
    return new this(options);
  }

  /**
   * Class constructor.
   * @param options.signMethod Optional setting of signature kind used in claims.
   * @param options.unsafeRecipientIds Optional list of addresses where normal transfer not
   * safeTransfer smart contract methods will be used.
   * @param options.assetLedgerSource Optional source where assetLedger compiled smart contracts are
   * located.
   * @param options.valueLedgerSource Optional source where valueLedger compiled smart contracts are
   * located.
   * @param options.requiredConfirmations Optional number of confirmations that are necessary to
   * mark a mutation complete.
   * @param options.orderGatewayId Optional ID (address) of order gateway.
   * @param options.mutationTimeout Optional number of milliseconds in which a mutation times out.
   * @param options.clientId Required Bitski client ID.
   * @param options.redirectUrl Required Bitski redirect url.
   * @param options.networkName Optional name of Ethereum network Bitski is connected to. Mainnet by
   * default.
   */
  public constructor(options: BitskiProviderOptions) {
    super(options);

    this._options = options;
    this._client = this;
    if (this.isSupported()) {
      const bitski = require('bitski');
      this._bitski = new bitski.Bitski(options.clientId, options.redirectUrl);
      this._provider = this._bitski.getProvider({
        networkName: typeof options.networkName === 'undefined' ? 'mainnet' : options.networkName,
      });
    }
  }

  /**
   * Is provider supported.
   */
  public isSupported() {
    return typeof window !== 'undefined';
  }

  /**
   * Checks if Bitski is connected.
   */
  public isSignedIn() {
    return (
      this.isSupported()
      && !!this.accountId
      && !!this._bitski
      && this._bitski.authStatus === 'CONNECTED'
    );
  }

  /**
   * Signs into Bitski.
   */
  public async signIn() {
    if (!this.isSupported()) {
      return false;
    }

    await this._bitski.start();
    this.accountId = await this.getAvailableAccounts().then((a) => a[0]);
    this.signOutHandler = () => {
      this.accountId = null;
      this._bitski.removeSignOutHandler(this.signOutHandler);
    };
    this._bitski.addSignOutHandler(this.signOutHandler);
    return this;
  }

  /**
   * Signs out of Bitski.
   */
  public async signOut() {
    if (!this.isSupported()) {
      return null;
    }
    await this._bitski.signOut();
    return this;
  }

  /**
   * Gets the current signed in user. Will reject if no user is signed in.
   */
  public async getConnectedUser() {
    if (!this.isSupported()) {
      return false;
    }
    return this._bitski.getUser();
  }

  /**
   * Sends the RPC call.
   * @param data JSON-RPC ethereum call.
   * @param callback Callback function to be executed.
   */
  public send(data: any, callback: (err, data) => any) {
    this._provider.sendAsync(data, callback);
  }
}
