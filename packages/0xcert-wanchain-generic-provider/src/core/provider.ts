import { GatewayConfig, GenericProvider as EthereumGenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import { Encode, Encoder } from '@0xcert/wanchain-utils';

/**
 * Configuration interface for generic provider.
 */
export interface GenericProviderOptions {

  /**
   * Default account from which all mutations are made.
   */
  accountId?: string;

  /**
   * RPC client instance (e.g. window.ethereum).
   */
  client?: any;

  /**
   * Type of signature that will be used in making claims etc.
   */
  signMethod?: SignMethod;

  /**
   * List of addresses wherecd  normal transfer not safeTransfer smart contract methods will be used.
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
   * Gateway configuration.
   */
  gatewayConfig?: GatewayConfig;

  /**
   * The number of milliseconds in which a mutation times out.
   */
  mutationTimeout?: number;

  /**
   * Encoder instance.
   */
  encoder?: Encode;

  /**
   * Gas price multiplier. Defaults to 1.1.
   */
  gasPriceMultiplier?: number;

  /**
   * Sandbox mode. False by default.
   */
  sandbox?: Boolean;
}

/**
 * Wanchain RPC client.
 */
export class GenericProvider extends EthereumGenericProvider {

  /**
   * Class constructor.
   * @param options.client RPC client instance (e.g. window.ethereum).
   * @param options.accountId Coinbase address.
   */
  public constructor(options: GenericProviderOptions) {
    super({
      encoder: typeof options.encoder !== 'undefined' ? options.encoder : new Encoder(),
      ...options,
    });
  }
}
