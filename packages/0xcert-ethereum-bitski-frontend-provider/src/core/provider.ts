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

  /**
   * Bitski client id.
   */
  clientId: string;

  /**
   * Bitski redirect url.
   */
  redirectUrl: string;

  /**
   * Which ethereum network bitski is connection to. Mainnet by default.
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
    return new BitskiProvider(options);
  }

  /**
   * Class constructor.
   */
  public constructor(options: BitskiProviderOptions) {
    super(options);

    this._options = options;
    this._client = this;
    if (typeof window !== 'undefined') {
      const bitski = require('bitski');
      this._bitski = new bitski.Bitski(options.clientId, options.redirectUrl);
      this._provider = this._bitski.getProvider({ networkName: options.networkName === 'undefined' ? 'mainnet' : options.networkName });
    } else {
      throw new Error('Cannot initialize bitski.');
    }
  }

  /**
   * Is provider supported.
   */
  public isSupported() {
    return typeof window !== 'undefined';
  }

  /**
   * Checks if bitski is connected.
   */
  public isSignedIn() {
    return this._bitski.authStatus === 'CONNECTED';
  }

  /**
   * Signs into bitski.
   */
  public async signIn() {
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
   * Signs out bitski.
   */
  public async signOut() {
    await this._bitski.signOut();
    return this;
  }

  /**
   * Gets the current signed in user. Will reject if we are not signed in.
   */
  public async getConnectedUser() {
    const user = await this._bitski.getUser();
    return user;
  }

  /**
   * Sends the RPC call.
   */
  public send(data: any, callback: (err, data) => any) {
    this._provider.sendAsync(data, callback);
  }
}
