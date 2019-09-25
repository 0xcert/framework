import { GatewayConfig, GenericProvider, Mutation, MutationEventSignature, MutationEventTypeKind, SignMethod } from '@0xcert/ethereum-generic-provider';
import { GatewayBase, Order, OrderKind } from '@0xcert/scaffold';
import { normalizeOrderIds as normalizeActionsOrderIds } from '../lib/actions-order';
import { normalizeOrderIds as normalizeAssetLedgerDeployOrderIds } from '../lib/asset-ledger-deploy-order';
import { normalizeOrderIds as normalizeValueLedgerDeployOrderIds } from '../lib/value-ledger-deploy-order';
import actionsOrderCancel from '../mutations/actions-order/cancel';
import actionsOrderPerform from '../mutations/actions-order/perform';
import assetLedgerDeployOrderCancel from '../mutations/asset-ledger-deploy-order/cancel';
import assetLedgerDeployOrderPerform from '../mutations/asset-ledger-deploy-order/perform';
import valueLedgerDeployOrderCancel from '../mutations/value-ledger-deploy-order/cancel';
import valueLedgerDeployOrderPerform from '../mutations/value-ledger-deploy-order/perform';
import actionsOrderClaimEthSign from '../queries/actions-order/claim-eth-sign';
import actionsOrderClaimPersonalSign from '../queries/actions-order/claim-personal-sign';
import getActionsOrderDataClaim from '../queries/actions-order/get-order-data-claim';
import getProxyAccountId from '../queries/actions-order/get-proxy-account-id';
import actionsOrderisValidSignature from '../queries/actions-order/is-valid-signature';
import assetLedgerDeployOrderClaimEthSign from '../queries/asset-ledger-deploy-order/claim-eth-sign';
import assetLedgerDeployOrderClaimPersonalSign from '../queries/asset-ledger-deploy-order/claim-personal-sign';
import getAssetLedgerDeployOrderDataClaim from '../queries/asset-ledger-deploy-order/get-order-data-claim';
import assetLedgerDeployOrderisValidSignature from '../queries/asset-ledger-deploy-order/is-valid-signature';
import valueLedgerDeployOrderClaimEthSign from '../queries/value-ledger-deploy-order/claim-eth-sign';
import valueLedgerDeployOrderClaimPersonalSign from '../queries/value-ledger-deploy-order/claim-personal-sign';
import getValueLedgerDeployOrderDataClaim from '../queries/value-ledger-deploy-order/get-order-data-claim';
import valueLedgerDeployOrderisValidSignature from '../queries/value-ledger-deploy-order/is-valid-signature';
import { ActionsGatewayProxy } from './types';

/**
 * Ethereum gateway implementation.
 */
export class Gateway implements GatewayBase {

  /**
   * Address of the smart contract that represents this gateway.
   */
  protected _config: GatewayConfig;

  /**
   * Provider instance.
   */
  protected _provider: GenericProvider;

  /**
   * Gets an instance of gateway.
   * @param provider  Provider class with which we comunicate with blockchain.
   * @param config Gateway configuration.
   */
  public static getInstance(provider: GenericProvider, config?: GatewayConfig): Gateway {
    return new this(provider, config);
  }

  /**
   * Initialize gateway.
   * @param provider  Provider class with which we comunicate with blockchain.
   * @param id Address of the gateway smart contract.
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
        actionsOrderId: this._provider.encoder.normalizeAddress(config.actionsOrderId),
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
    if (order.kind === OrderKind.ACTIONS_ORDER) {
      order = normalizeActionsOrderIds(order, this._provider);
      if (this._provider.signMethod == SignMethod.PERSONAL_SIGN) {
        return actionsOrderClaimPersonalSign(this, order);
      } else {
        return actionsOrderClaimEthSign(this, order);
      }
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      if (this._provider.signMethod == SignMethod.PERSONAL_SIGN) {
        return assetLedgerDeployOrderClaimPersonalSign(this, order);
      } else {
        return assetLedgerDeployOrderClaimEthSign(this, order);
      }
    } else if (order.kind === OrderKind.VALUE_LEDGER_DEPLOY_ORDER) {
      order = normalizeValueLedgerDeployOrderIds(order, this._provider);
      if (this._provider.signMethod == SignMethod.PERSONAL_SIGN) {
        return valueLedgerDeployOrderClaimPersonalSign(this, order);
      } else {
        return valueLedgerDeployOrderClaimEthSign(this, order);
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
    if (order.kind === OrderKind.ACTIONS_ORDER) {
      order = normalizeActionsOrderIds(order, this._provider);
      return actionsOrderPerform(this, order, claim);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return assetLedgerDeployOrderPerform(this, order, claim);
    } else if (order.kind === OrderKind.VALUE_LEDGER_DEPLOY_ORDER) {
      order = normalizeValueLedgerDeployOrderIds(order, this._provider);
      return valueLedgerDeployOrderPerform(this, order, claim);
    } else {
      throw new Error('Not implemented');
    }
  }

  /**
   * Cancels an order.
   * @param order Order data.
   */
  public async cancel(order: Order): Promise<Mutation> {
    if (order.kind === OrderKind.ACTIONS_ORDER) {
      order = normalizeActionsOrderIds(order, this._provider);
      return actionsOrderCancel(this, order);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return assetLedgerDeployOrderCancel(this, order);
    } else if (order.kind === OrderKind.VALUE_LEDGER_DEPLOY_ORDER) {
      order = normalizeValueLedgerDeployOrderIds(order, this._provider);
      return valueLedgerDeployOrderCancel(this, order);
    } else {
      throw new Error('Not implemented');
    }
  }

  /**
   * Gets address of the proxy based on the id.
   * @param proxyId Id of the proxy.
   */
  public async getProxyAccountId(proxyId: ActionsGatewayProxy) {
    return getProxyAccountId(this, proxyId);
  }

  /**
   * Checks if claim for this order is valid.
   * @param order Order data.
   * @param claim Claim data.
   */
  public async isValidSignature(order: Order, claim: string) {
    if (order.kind === OrderKind.ACTIONS_ORDER) {
      order = normalizeActionsOrderIds(order, this._provider);
      return actionsOrderisValidSignature(this, order, claim);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return assetLedgerDeployOrderisValidSignature(this, order, claim);
    } else if (order.kind === OrderKind.VALUE_LEDGER_DEPLOY_ORDER) {
      order = normalizeValueLedgerDeployOrderIds(order, this._provider);
      return valueLedgerDeployOrderisValidSignature(this, order, claim);
    } else {
      throw new Error('Not implemented');
    }
  }

  /**
   * Generates hash from order.
   * @param order Order data.
   */
  public async getOrderDataClaim(order: Order) {
    if (order.kind === OrderKind.ACTIONS_ORDER) {
      order = normalizeActionsOrderIds(order, this._provider);
      return getActionsOrderDataClaim(this, order);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return getAssetLedgerDeployOrderDataClaim(this, order);
    } else if (order.kind === OrderKind.VALUE_LEDGER_DEPLOY_ORDER) {
      order = normalizeValueLedgerDeployOrderIds(order, this._provider);
      return getValueLedgerDeployOrderDataClaim(this, order);
    } else {
      throw new Error('Not implemented');
    }
  }

  /**
   * Gets context for mutation event parsing.
   * This are event definitions for Gateway smart contracts event parsing. This method is used
   * by the Mutation class to provide log information.
   */
  public getContext(): MutationEventSignature[] {
    return [
      {
        name: 'ProxyChange',
        topic: '0x8edda873a8ad561ecebeb71ceb3ae6bcb70c2b76a3fcb869859895c4d4fc7416',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'index',
            type: 'uint256',
          },
          {
            kind: MutationEventTypeKind.NORMAL,
            name: 'proxy',
            type: 'address',
          },
        ],
      },
      {
        name: 'Perform',
        topic: '0xdd97b854c02f699ea0d8984479d0012fbbbd0f4f80fc2e099315f6c47a3da178',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'maker',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'taker',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.NORMAL,
            name: 'claim',
            type: 'bytes32',
          },
        ],
      },
      {
        name: 'Cancel',
        topic: '0x421b43caf093b5e58d1ea89ca0d80151eda923342cf3cfddf5eb6b30d4947ba0',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'maker',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'taker',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.NORMAL,
            name: 'claim',
            type: 'bytes32',
          },
        ],
      },
      {
        name: 'Perform',
        topic: '0x492318801c2cec532d47019a0b69f83b8d5b499a022b7adb6100a766050644f2',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'maker',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'taker',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.NORMAL,
            name: 'createdContract',
            type: 'address',
          },
          {
            kind: MutationEventTypeKind.NORMAL,
            name: 'claim',
            type: 'bytes32',
          },
        ],
      },
    ];
  }
}
