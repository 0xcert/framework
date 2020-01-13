import { GatewayConfig, GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import * as Bitski from 'bitski-node';

/**
 * Configuration interface for generic provider.
 */
export interface BitskiProviderOptions {

  /**
   * Default account from which all mutations are made.
   */
  accountId?: string;

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
   * Number of confirmations (blocks in blockchain after mutation is accepted) that are necessary to mark
   * a mutation complete.
   */
  requiredConfirmations?: number;

  /**
   * Gateway configuration.
   */
  gatewayConfig?: GatewayConfig;

  /**
   * The number of milliseconds in which a mutation times out.
   */
  mutationTimeout?: number;

  /**
   * Bitski client ID.
   */
  clientId: string;

  /**
   * Bitski credentials ID.
   */
  credentialsId: string;

  /**
   * Bitski credentials secret.
   */
  credentialsSecret: string;

  /**
   * Ethereum network Bitski is connected to. Mainnet by default.
   */
  network?: string;

  /**
   * Gas price multiplier. Defaults to 1.1.
   */
  gasPriceMultiplier?: number;

  /**
   * Retry gas price multiplier. Defaults to 2.
   */
  retryGasPriceMultiplier?: number;

  /**
   * Sandbox mode. False by default.
   */
  sandbox?: Boolean;

  /**
   * Verbose mode. False by default.
   */
  verbose?: Boolean;
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
   * Bitski provider instance.
   */
  protected _provider: any;

  /**
   * Returns a new provider instance.
   * @param options HTTP provider options.
   */
  public static getInstance(options: BitskiProviderOptions): BitskiProvider {
    return new this(options);
  }

  /**
   * Class constructor.
   * @param options.accountId Optional coinbase account.
   * @param options.signMethod Optional setting of signature kind used in claims.
   * @param options.unsafeRecipientIds Optional list of addresses where normal transfer not
   * safeTransfer smart contract methods will be used.
   * @param options.assetLedgerSource Optional source where assetLedger compiled smart contracts are
   * located.
   * @param options.valueLedgerSource Optional source where valueLedger compiled smart contracts are
   * located.
   * @param options.requiredConfirmations Optional number of confirmations that are necessary to
   * mark a mutation complete.
   * @param options.gatewayConfig Gateway configuration.
   * @param options.mutationTimeout Optional number of milliseconds in which a mutation times out.
   * @param options.clientId Required Bitski client ID.
   * @param options.credentialsId Required Bitski credentials ID.
   * @param options.credentialsSecret Required Bitski credentials secret.
   * @param options.network Optional name of Ethereum network Bitski is connected to. Mainnet by
   * default.
   */
  public constructor(options: BitskiProviderOptions) {
    super(options);

    this._options = options;
    this._client = this;
    this._provider = Bitski.getProvider(options.clientId, {
      network: typeof options.network === 'undefined' ? 'mainnet' : options.network,
      credentials: {
        id: options.credentialsId,
        secret: options.credentialsSecret,
      },
    });
  }

  /**
   * Is provider supported.
   */
  public isSupported() {
    return !!this._provider;
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
