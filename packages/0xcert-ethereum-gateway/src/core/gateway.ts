import { GatewayConfig, GenericProvider, Mutation, SignMethod } from '@0xcert/ethereum-generic-provider';
import { GatewayBase, Order, OrderKind } from '@0xcert/scaffold';
import { normalizeOrderIds as normalizeAssetLedgerDeployOrderIds } from '../lib/asset-ledger-deploy-order';
import { normalizeOrderIds as normalizeMultiOrderIds } from '../lib/multi-order';
import assetLedgerDeployOrderCancel from '../mutations/asset-ledger-deploy-order/cancel';
import assetLedgerDeployOrderPerform from '../mutations/asset-ledger-deploy-order/perform';
import multiOrderCancel from '../mutations/multi-order/cancel';
import multiOrderPerform from '../mutations/multi-order/perform';
import assetLedgerDeployOrderClaimEthSign from '../queries/asset-ledger-deploy-order/claim-eth-sign';
import assetLedgerDeployOrderClaimPersonalSign from '../queries/asset-ledger-deploy-order/claim-personal-sign';
import getAssetLedgerDeployOrderDataClaim from '../queries/asset-ledger-deploy-order/get-order-data-claim';
import assetLedgerDeployOrderisValidSignature from '../queries/asset-ledger-deploy-order/is-valid-signature';
import multiOrderClaimEthSign from '../queries/multi-order/claim-eth-sign';
import multiOrderClaimPersonalSign from '../queries/multi-order/claim-personal-sign';
import getMultiOrderDataClaim from '../queries/multi-order/get-order-data-claim';
import getProxyAccountId from '../queries/multi-order/get-proxy-account-id';
import multiOrderisValidSignature from '../queries/multi-order/is-valid-signature';
import { OrderGatewayProxy } from './types';

/**
 * Ethereum order gateway implementation.
 */
export class Gateway implements GatewayBase {

  /**
   * Address of the smart contract that represents this order gateway.
   */
  protected _config: GatewayConfig;

  /**
   * Provider instance.
   */
  protected _provider: GenericProvider;

  /**
   * Gets an instance of order gateway.
   * @param provider  Provider class with which we comunicate with blockchain.
   * @param config Gateway configuration.
   */
  public static getInstance(provider: GenericProvider, config?: GatewayConfig): Gateway {
    return new this(provider, config);
  }

  /**
   * Initialize order gateway.
   * @param provider  Provider class with which we comunicate with blockchain.
   * @param id Address of the order gateway smart contract.
   */
  public constructor(provider: GenericProvider, config?: GatewayConfig) {
    this._provider = provider;
    this.config = config || provider.gatewayConfig;
  }

  /**
   * Returns gateway config.
   */
  public get config(): GatewayConfig {
    return this._config || null;
  }

  /**
   * Sets and normalizes gateway config.
   */
  public set config(config: GatewayConfig) {
    if (typeof config !== 'undefined') {
      this._config = {
        multiOrderId: this._provider.encoder.normalizeAddress(config.multiOrderId),
        assetLedgerDeployOrderId: this._provider.encoder.normalizeAddress(config.assetLedgerDeployOrderId),
        valueLedgerDeployOrderId: this._provider.encoder.normalizeAddress(config.valueLedgerDeployOrderId),
      };
    } else {
      this._config = null;
    }
  }

  /**
   * Gets the provider that is used to comunicate with blockchain.
   */
  public get provider() {
    return this._provider;
  }

  /**
   * Gets signed claim for an order.
   * @param order Order data.
   */
  public async claim(order: Order): Promise<string> {
    if (order.kind === OrderKind.MULTI_ORDER) {
      order = normalizeMultiOrderIds(order, this._provider);
      if (this._provider.signMethod == SignMethod.PERSONAL_SIGN) {
        return multiOrderClaimPersonalSign(this, order);
      } else {
        return multiOrderClaimEthSign(this, order);
      }
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      if (this._provider.signMethod == SignMethod.PERSONAL_SIGN) {
        return assetLedgerDeployOrderClaimPersonalSign(this, order);
      } else {
        return assetLedgerDeployOrderClaimEthSign(this, order);
      }
    } else {
      throw new Error('Not implemented');
    }
  }

  /**
   * Performs an order.
   * @param order Order data.
   * @param claim Claim data.
   */
  public async perform(order: Order, claim: string): Promise<Mutation> {
    if (order.kind === OrderKind.MULTI_ORDER) {
      order = normalizeMultiOrderIds(order, this._provider);
      return multiOrderPerform(this, order, claim);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return assetLedgerDeployOrderPerform(this, order, claim);
    } else {
      throw new Error('Not implemented');
    }
  }

  /**
   * Cancels an order.
   * @param order Order data.
   */
  public async cancel(order: Order): Promise<Mutation> {
    if (order.kind === OrderKind.MULTI_ORDER) {
      order = normalizeMultiOrderIds(order, this._provider);
      return multiOrderCancel(this, order);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return assetLedgerDeployOrderCancel(this, order);
    } else {
      throw new Error('Not implemented');
    }
  }

  /**
   * Gets address of the proxy based on the id.
   * @param proxyId Id of the proxy.
   */
  public async getProxyAccountId(proxyId: OrderGatewayProxy) {
    return getProxyAccountId(this, proxyId);
  }

  /**
   * Checks if claim for this order is valid.
   * @param order Order data.
   * @param claim Claim data.
   */
  public async isValidSignature(order: Order, claim: string) {
    if (order.kind === OrderKind.MULTI_ORDER) {
      order = normalizeMultiOrderIds(order, this._provider);
      return multiOrderisValidSignature(this, order, claim);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return assetLedgerDeployOrderisValidSignature(this, order, claim);
    } else {
      throw new Error('Not implemented');
    }
  }

  /**
   * Generates hash from order.
   * @param order Order data.
   */
  public async getOrderDataClaim(order: Order) {
    if (order.kind === OrderKind.MULTI_ORDER) {
      order = normalizeMultiOrderIds(order, this._provider);
      return getMultiOrderDataClaim(this, order);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return getAssetLedgerDeployOrderDataClaim(this, order);
    } else {
      throw new Error('Not implemented');
    }
  }

}
