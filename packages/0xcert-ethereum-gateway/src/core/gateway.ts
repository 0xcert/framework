import { GenericProvider, Mutation, SignMethod } from '@0xcert/ethereum-generic-provider';
import { GatewayBase, Order, OrderKind } from '@0xcert/scaffold';
import { normalizeOrderIds } from '../lib/multi-order';
import cancel from '../mutations/multi-order/cancel';
import perform from '../mutations/multi-order/perform';
import claimEthSign from '../queries/multi-order/claim-eth-sign';
import claimPersonalSign from '../queries/multi-order/claim-personal-sign';
import getOrderDataClaim from '../queries/multi-order/get-order-data-claim';
import getProxyAccountId from '../queries/multi-order/get-proxy-account-id';
import isValidSignature from '../queries/multi-order/is-valid-signature';
import { OrderGatewayProxy } from './types';

/**
 * Ethereum order gateway implementation.
 */
export class Gateway implements GatewayBase {

  /**
   * Address of the smart contract that represents this order gateway.
   */
  protected _id: string;

  /**
   * Provider instance.
   */
  protected _provider: GenericProvider;

  /**
   * Gets an instance of order gateway.
   * @param provider  Provider class with which we comunicate with blockchain.
   * @param id Address of the order gateway smart contract.
   */
  public static getInstance(provider: GenericProvider, id?: string): Gateway {
    return new this(provider, id);
  }

  /**
   * Initialize order gateway.
   * @param provider  Provider class with which we comunicate with blockchain.
   * @param id Address of the order gateway smart contract.
   */
  public constructor(provider: GenericProvider, id?: string) {
    this._provider = provider;
    this._id = this._provider.encoder.normalizeAddress(id || provider.orderGatewayId);
  }

  /**
   * Gets the address of the smart contract that represents this order gateway.
   */
  public get id() {
    return this._id;
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
      order = normalizeOrderIds(order, this._provider);
      if (this._provider.signMethod == SignMethod.PERSONAL_SIGN) {
        return claimPersonalSign(this, order);
      } else {
        return claimEthSign(this, order);
      }
    } else {
      // todo deploy
    }
  }

  /**
   * Performs an order.
   * @param order Order data.
   * @param claim Claim data.
   */
  public async perform(order: Order, claim: string): Promise<Mutation> {
    if (order.kind === OrderKind.MULTI_ORDER) {
      order = normalizeOrderIds(order, this._provider);
      return perform(this, order, claim);
    } else {
      // todo deploy
    }
  }

  /**
   * Cancels an order.
   * @param order Order data.
   */
  public async cancel(order: Order): Promise<Mutation> {
    if (order.kind === OrderKind.MULTI_ORDER) {
      order = normalizeOrderIds(order, this._provider);
      return cancel(this, order);
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
      order = normalizeOrderIds(order, this._provider);
      return isValidSignature(this, order, claim);
    }
  }

  /**
   * Generates hash from order.
   * @param order Order data.
   */
  public async getOrderDataClaim(order: Order) {
    if (order.kind === OrderKind.MULTI_ORDER) {
      order = normalizeOrderIds(order, this._provider);
      return getOrderDataClaim(this, order);
    }
  }

}
