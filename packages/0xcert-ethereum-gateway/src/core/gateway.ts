import { GatewayConfig, GenericProvider, Mutation, MutationEventSignature, MutationEventTypeKind, SignMethod } from '@0xcert/ethereum-generic-provider';
import { ZERO_ADDRESS } from '@0xcert/ethereum-utils';
import { AssetLedgerDeployOrder, AssetSetOperatorOrder, DappValueApproveOrder, DynamicActionsOrder, FixedActionsOrder, GatewayBase, Order, OrderKind,
  ProviderError, ProviderIssue, SignedDynamicActionsOrder, SignedFixedActionsOrder, ValueLedgerDeployOrder } from '@0xcert/scaffold';
import { createOrderHash as createActionsOrderHash, normalizeOrderIds as normalizeActionsOrderIds } from '../lib/actions-order';
import { createOrderHash as createAssetLedgerDeployOrderHash, normalizeOrderIds as normalizeAssetLedgerDeployOrderIds } from '../lib/asset-ledger-deploy-order';
import { createOrderHash as createAssetSetOperatorOrderHash, normalizeOrderIds as normalizeAssetSetOperatorOrderIds } from '../lib/asset-set-operator-order';
import { createOrderHash as createDappValueApproveOrderHash, normalizeOrderIds as normalizeDappValueApproveOrderIds } from '../lib/dapp-value-approve-order';
import { createOrderHash as createValueLedgerDeployOrderHash, normalizeOrderIds as normalizeValueLedgerDeployOrderIds } from '../lib/value-ledger-deploy-order';
import actionsOrderCancel from '../mutations/actions-order/cancel';
import actionsOrderPerform from '../mutations/actions-order/perform';
import assetLedgerDeployOrderCancel from '../mutations/asset-ledger-deploy-order/cancel';
import assetLedgerDeployOrderPerform from '../mutations/asset-ledger-deploy-order/perform';
import assetSetOperatorOrderCancel from '../mutations/asset-set-operator-order/cancel';
import assetSetOperatorOrderPerform from '../mutations/asset-set-operator-order/perform';
import dappValueApproveOrderCancel from '../mutations/dapp-value-approve-order/cancel';
import dappValueApproveOrderPerform from '../mutations/dapp-value-approve-order/perform';
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
import assetSetOperatorOrderClaimEthSign from '../queries/asset-set-operator-order/claim-eth-sign';
import assetSetOperatorOrderClaimPersonalSign from '../queries/asset-set-operator-order/claim-personal-sign';
import getAssetSetOperatorOrderDataClaim from '../queries/asset-set-operator-order/get-order-data-claim';
import assetSetOperatorOrderisValidSignature from '../queries/asset-set-operator-order/is-valid-signature';
import dappValueApproveOrderClaimEthSign from '../queries/dapp-value-approve-order/claim-eth-sign';
import dappValueApproveOrderClaimPersonalSign from '../queries/dapp-value-approve-order/claim-personal-sign';
import getDappValueApproveOrderDataClaim from '../queries/dapp-value-approve-order/get-order-data-claim';
import dappValueApproveOrderisValidSignature from '../queries/dapp-value-approve-order/is-valid-signature';
import valueLedgerDeployOrderClaimEthSign from '../queries/value-ledger-deploy-order/claim-eth-sign';
import valueLedgerDeployOrderClaimPersonalSign from '../queries/value-ledger-deploy-order/claim-personal-sign';
import getValueLedgerDeployOrderDataClaim from '../queries/value-ledger-deploy-order/get-order-data-claim';
import valueLedgerDeployOrderisValidSignature from '../queries/value-ledger-deploy-order/is-valid-signature';
import { ProxyId, ProxyKind } from './types';

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
   * @param provider  Provider class with which we communicate with blockchain.
   * @param config Gateway configuration.
   */
  public static getInstance(provider: GenericProvider, config?: GatewayConfig): Gateway {
    return new this(provider, config);
  }

  /**
   * Initialize gateway.
   * @param provider  Provider class with which we comunicate with blockchain.
   * @param config Gateway config.
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
    if (config) {
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
   * Gets the provider that is used to communicate with blockchain.
   */
  public get provider() {
    return this._provider;
  }

  /**
   * Gets hash of an order.
   * @param order Order data.
   */
  public async hash(order: Order): Promise<string> {
    if (order.kind === OrderKind.DYNAMIC_ACTIONS_ORDER
      || order.kind === OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER
    ) {
      order = this.createDynamicOrder(order);
      order = normalizeActionsOrderIds(order, this._provider);
      return createActionsOrderHash(this, order);
    } else if (order.kind === OrderKind.FIXED_ACTIONS_ORDER
      || order.kind === OrderKind.SIGNED_FIXED_ACTIONS_ORDER
    ) {
      order = normalizeActionsOrderIds(order, this._provider);
      return createActionsOrderHash(this, order);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return createAssetLedgerDeployOrderHash(this, order);
    } else if (order.kind === OrderKind.VALUE_LEDGER_DEPLOY_ORDER) {
      order = normalizeValueLedgerDeployOrderIds(order, this._provider);
      return createValueLedgerDeployOrderHash(this, order);
    } else if (order.kind === OrderKind.ASSET_SET_OPERATOR_ORDER) {
      order = normalizeAssetSetOperatorOrderIds(order, this._provider);
      return createAssetSetOperatorOrderHash(order);
    } else if (order.kind === OrderKind.DAPP_VALUE_APPROVE_ORDER) {
      order = normalizeDappValueApproveOrderIds(order, this._provider);
      return createDappValueApproveOrderHash(order);
    } else {
      throw new Error('Not implemented');
    }
  }

  /**
   * Gets signed claim for an order.
   * @param order Order data.
   */
  public async sign(order: Order): Promise<string> {
    if (order.kind === OrderKind.DYNAMIC_ACTIONS_ORDER
      || order.kind === OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER
    ) {
      order = this.createDynamicOrder(order);
      order = normalizeActionsOrderIds(order, this._provider);
      if (this._provider.signMethod == SignMethod.PERSONAL_SIGN) {
        return actionsOrderClaimPersonalSign(this, order);
      } else {
        return actionsOrderClaimEthSign(this, order);
      }
    } else if (order.kind === OrderKind.FIXED_ACTIONS_ORDER
      || order.kind === OrderKind.SIGNED_FIXED_ACTIONS_ORDER
    ) {
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
    } else if (order.kind === OrderKind.ASSET_SET_OPERATOR_ORDER) {
      order = normalizeAssetSetOperatorOrderIds(order, this._provider);
      if (this._provider.signMethod == SignMethod.PERSONAL_SIGN) {
        return assetSetOperatorOrderClaimPersonalSign(this, order);
      } else {
        return assetSetOperatorOrderClaimEthSign(this, order);
      }
    } else if (order.kind === OrderKind.DAPP_VALUE_APPROVE_ORDER) {
      order = normalizeDappValueApproveOrderIds(order, this._provider);
      if (this._provider.signMethod == SignMethod.PERSONAL_SIGN) {
        return dappValueApproveOrderClaimPersonalSign(this, order);
      } else {
        return dappValueApproveOrderClaimEthSign(this, order);
      }
    } else {
      throw new Error('Not implemented');
    }
  }

  /**
   * Performs an order.
   * @param order Order data.
   * @param signature Signature data.
   */
  public async perform(order: DynamicActionsOrder, signature: string[]): Promise<Mutation>;
  public async perform(order: SignedDynamicActionsOrder, signature: string[]): Promise<Mutation>;
  public async perform(order: FixedActionsOrder, signature: string[]): Promise<Mutation>;
  public async perform(order: SignedFixedActionsOrder, signature: string[]): Promise<Mutation>;
  public async perform(order: AssetLedgerDeployOrder, signature: string): Promise<Mutation>;
  public async perform(order: ValueLedgerDeployOrder, signature: string): Promise<Mutation>;
  public async perform(order: AssetSetOperatorOrder, signature: string): Promise<Mutation>;
  public async perform(order: DappValueApproveOrder, signature: string): Promise<Mutation>;
  public async perform(order: any, signature: any): Promise<Mutation> {
    if (order.kind === OrderKind.DYNAMIC_ACTIONS_ORDER) {
      order = this.createDynamicOrder(order);
      if (order.signers.length !== signature.length + 1) {
        throw new ProviderError(ProviderIssue.DYNAMIC_ACTIONS_ORDER_SIGNATURES);
      }
      order = normalizeActionsOrderIds(order, this._provider);
      return actionsOrderPerform(this, order, signature);
    } else if (order.kind === OrderKind.FIXED_ACTIONS_ORDER) {
      if (order.signers.length !== signature.length + 1) {
        throw new ProviderError(ProviderIssue.FIXED_ACTIONS_ORDER_SIGNATURES);
      }
      order = normalizeActionsOrderIds(order, this._provider);
      return actionsOrderPerform(this, order, signature as string[]);
    } else if (order.kind === OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER) {
      order = this.createDynamicOrder(order);
      if (order.signers.length !== signature.length) {
        throw new ProviderError(ProviderIssue.SIGNED_DYNAMIC_ACTIONS_ORDER_SIGNATURES);
      }
      order = normalizeActionsOrderIds(order, this._provider);
      return actionsOrderPerform(this, order, signature as string[]);
    } else if (order.kind === OrderKind.SIGNED_FIXED_ACTIONS_ORDER) {
      if (order.signers.length !== signature.length) {
        throw new ProviderError(ProviderIssue.SIGNED_FIXED_ACTIONS_ORDER_SIGNATURES);
      }
      order = normalizeActionsOrderIds(order, this._provider);
      return actionsOrderPerform(this, order, signature as string[]);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return assetLedgerDeployOrderPerform(this, order, signature);
    } else if (order.kind === OrderKind.VALUE_LEDGER_DEPLOY_ORDER) {
      order = normalizeValueLedgerDeployOrderIds(order, this._provider);
      return valueLedgerDeployOrderPerform(this, order, signature);
    } else if (order.kind === OrderKind.ASSET_SET_OPERATOR_ORDER) {
      order = normalizeAssetSetOperatorOrderIds(order, this._provider);
      return assetSetOperatorOrderPerform(this, order, signature);
    } else if (order.kind === OrderKind.DAPP_VALUE_APPROVE_ORDER) {
      order = normalizeDappValueApproveOrderIds(order, this._provider);
      return dappValueApproveOrderPerform(this, order, signature);
    } else {
      throw new ProviderError(ProviderIssue.ACTIONS_ORDER_KIND_NOT_SUPPORTED);
    }
  }

  /**
   * Cancels an order.
   * @param order Order data.
   */
  public async cancel(order: Order): Promise<Mutation> {
    if (order.kind === OrderKind.DYNAMIC_ACTIONS_ORDER
      || order.kind === OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER
    ) {
      order = this.createDynamicOrder(order);
      order = normalizeActionsOrderIds(order, this._provider);
      return actionsOrderCancel(this, order);
    } else if (order.kind === OrderKind.FIXED_ACTIONS_ORDER
      || order.kind === OrderKind.SIGNED_FIXED_ACTIONS_ORDER
    ) {
      order = normalizeActionsOrderIds(order, this._provider);
      return actionsOrderCancel(this, order);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return assetLedgerDeployOrderCancel(this, order);
    } else if (order.kind === OrderKind.VALUE_LEDGER_DEPLOY_ORDER) {
      order = normalizeValueLedgerDeployOrderIds(order, this._provider);
      return valueLedgerDeployOrderCancel(this, order);
    } else if (order.kind === OrderKind.ASSET_SET_OPERATOR_ORDER) {
      order = normalizeAssetSetOperatorOrderIds(order, this._provider);
      return assetSetOperatorOrderCancel(this, order);
    } else if (order.kind === OrderKind.DAPP_VALUE_APPROVE_ORDER) {
      order = normalizeDappValueApproveOrderIds(order, this._provider);
      return dappValueApproveOrderCancel(this, order);
    } else {
      throw new ProviderError(ProviderIssue.ACTIONS_ORDER_KIND_NOT_SUPPORTED);
    }
  }

  /**
   * Gets address of the proxy based on the kind.
   * @param proxyKind Kind of the proxy.
   */
  public async getProxyAccountId(proxyKind: ProxyKind.TRANSFER_ASSET, ledgerId?: string);
  public async getProxyAccountId(proxyKind: ProxyKind.CREATE_ASSET);
  public async getProxyAccountId(proxyKind: ProxyKind.DESTROY_ASSET);
  public async getProxyAccountId(proxyKind: ProxyKind.MANAGE_ABILITIES);
  public async getProxyAccountId(proxyKind: ProxyKind.TRANSFER_TOKEN);
  public async getProxyAccountId(proxyKind: ProxyKind.UPDATE_ASSET);
  public async getProxyAccountId(...args: any[]) {
    let proxyId = ProxyId.NFTOKEN_SAFE_TRANSFER;
    switch (args[0]) {
      case ProxyKind.TRANSFER_ASSET: {
        if (typeof args[1] !== 'undefined' && this.provider.unsafeRecipientIds.indexOf(args[1]) !== -1) {
          proxyId = ProxyId.NFTOKEN_TRANSFER;
        }
        break;
      }
      case ProxyKind.CREATE_ASSET: {
        proxyId = ProxyId.XCERT_CREATE;
        break;
      }
      case ProxyKind.DESTROY_ASSET: {
        proxyId = ProxyId.XCERT_BURN;
        break;
      }
      case ProxyKind.MANAGE_ABILITIES: {
        proxyId = ProxyId.MANAGE_ABILITIES;
        break;
      }
      case ProxyKind.TRANSFER_TOKEN: {
        proxyId = ProxyId.TOKEN_TRANSFER;
        break;
      }
      case ProxyKind.UPDATE_ASSET: {
        proxyId = ProxyId.XCERT_UPDATE;
        break;
      }
      default: {
        throw new ProviderError(ProviderIssue.PROXY_KIND_NOT_SUPPORTED);
      }
    }
    return getProxyAccountId(this, proxyId);
  }

  /**
   * Checks if claim for this order is valid.
   * @param order Order data.
   * @param claim Claim data.
   */
  public async isValidSignature(order: Order, claim: string, signer?: string) {
    if (order.kind === OrderKind.DYNAMIC_ACTIONS_ORDER
      || order.kind === OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER
      && signer !== 'undefined'
    ) {
      order = this.createDynamicOrder(order);
      order = normalizeActionsOrderIds(order, this._provider);
      return actionsOrderisValidSignature(this, order, claim, signer);
    } else if (order.kind === OrderKind.FIXED_ACTIONS_ORDER
      || order.kind === OrderKind.SIGNED_FIXED_ACTIONS_ORDER
      && signer !== 'undefined'
    ) {
      order = normalizeActionsOrderIds(order, this._provider);
      return actionsOrderisValidSignature(this, order, claim, signer);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return assetLedgerDeployOrderisValidSignature(this, order, claim);
    } else if (order.kind === OrderKind.VALUE_LEDGER_DEPLOY_ORDER) {
      order = normalizeValueLedgerDeployOrderIds(order, this._provider);
      return valueLedgerDeployOrderisValidSignature(this, order, claim);
    } else if (order.kind === OrderKind.ASSET_SET_OPERATOR_ORDER) {
      order = normalizeAssetSetOperatorOrderIds(order, this._provider);
      return assetSetOperatorOrderisValidSignature(this, order, claim);
    } else if (order.kind === OrderKind.DAPP_VALUE_APPROVE_ORDER) {
      order = normalizeDappValueApproveOrderIds(order, this._provider);
      return dappValueApproveOrderisValidSignature(this, order, claim);
    } else {
      throw new ProviderError(ProviderIssue.ACTIONS_ORDER_KIND_NOT_SUPPORTED);
    }
  }

  /**
   * Generates hash from order.
   * @param order Order data.
   */
  public async getOrderDataClaim(order: Order) {
    if (order.kind === OrderKind.DYNAMIC_ACTIONS_ORDER
      || order.kind === OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER
    ) {
      order = this.createDynamicOrder(order);
      order = normalizeActionsOrderIds(order, this._provider);
      return getActionsOrderDataClaim(this, order);
    } else if (order.kind === OrderKind.FIXED_ACTIONS_ORDER
      || order.kind === OrderKind.SIGNED_FIXED_ACTIONS_ORDER
    ) {
      order = normalizeActionsOrderIds(order, this._provider);
      return getActionsOrderDataClaim(this, order);
    } else if (order.kind === OrderKind.ASSET_LEDGER_DEPLOY_ORDER) {
      order = normalizeAssetLedgerDeployOrderIds(order, this._provider);
      return getAssetLedgerDeployOrderDataClaim(this, order);
    } else if (order.kind === OrderKind.VALUE_LEDGER_DEPLOY_ORDER) {
      order = normalizeValueLedgerDeployOrderIds(order, this._provider);
      return getValueLedgerDeployOrderDataClaim(this, order);
    } else if (order.kind === OrderKind.ASSET_SET_OPERATOR_ORDER) {
      order = normalizeAssetSetOperatorOrderIds(order, this._provider);
      return getAssetSetOperatorOrderDataClaim(this, order);
    } else if (order.kind === OrderKind.DAPP_VALUE_APPROVE_ORDER) {
      order = normalizeDappValueApproveOrderIds(order, this._provider);
      return getDappValueApproveOrderDataClaim(this, order);
    } else {
      throw new ProviderError(ProviderIssue.ACTIONS_ORDER_KIND_NOT_SUPPORTED);
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
        name: 'Perform', // actions order
        topic: '0xa4be90ab47bcea0c591eaa7dd28b8ba0329e7ebddac48c5f2ca9fed68d08cf08',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'claim',
            type: 'bytes32',
          },
        ],
      },
      {
        name: 'Cancel', // actions order
        topic: '0xe8d9861dbc9c663ed3accd261bbe2fe01e0d3d9e5f51fa38523b265c7757a93a',
        types: [
          {
            kind: MutationEventTypeKind.INDEXED,
            name: 'claim',
            type: 'bytes32',
          },
        ],
      },
      {
        name: 'Perform', // deploy asset/value ledger order
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
      {
        name: 'Cancel', // deploy asset/value ledger order
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
    ];
  }

  /**
   * For dynamic actions orders the last signer must be specified as zero address.
   */
  protected createDynamicOrder(order: DynamicActionsOrder | SignedDynamicActionsOrder) {
    order = JSON.parse(JSON.stringify(order));
    order.signers.push(ZERO_ADDRESS);
    return order;
  }

}
