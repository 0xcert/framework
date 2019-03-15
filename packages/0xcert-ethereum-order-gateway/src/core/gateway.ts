import { GenericProvider, Mutation, SignMethod } from '@0xcert/ethereum-generic-provider';
import { normalizeAddress } from '@0xcert/ethereum-utils';
import { Order, OrderGatewayBase } from '@0xcert/scaffold';
import { normalizeOrderIds } from '../lib/order';
import cancel from '../mutations/cancel';
import perform from '../mutations/perform';
import claimEthSign from '../queries/claim-eth-sign';
import claimPersonalSign from '../queries/claim-personal-sign';
import getOrderDataClaim from '../queries/get-order-data-claim';
import getProxyAccountId from '../queries/get-proxy-account-id';
import isValidSignature from '../queries/is-valid-signature';
import { OrderGatewayProxy } from './types';

/**
 * Ethereum order gateway implementation.
 */
export class OrderGateway implements OrderGatewayBase {

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
  public static getInstance(provider: GenericProvider, id?: string): OrderGateway {
    return new OrderGateway(provider, id);
  }

  /**
   * Initialize order gateway.
   * @param provider  Provider class with which we comunicate with blockchain.
   * @param id Address of the order gateway smart contract.
   */
  public constructor(provider: GenericProvider, id?: string) {
    this._id = normalizeAddress(id || provider.orderGatewayId);
    this._provider = provider;
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
    order = normalizeOrderIds(order);

    if (this._provider.signMethod == SignMethod.PERSONAL_SIGN) {
      return claimPersonalSign(this, order);
    } else {
      return claimEthSign(this, order);
    }
  }

  /**
   * Performs an order.
   * @param order Order data.
   * @param claim Claim data.
   */
  public async perform(order: Order, claim: string): Promise<Mutation> {
    order = normalizeOrderIds(order);

    return perform(this, order, claim);
  }

  /**
   * Cancels an order.
   * @param order Order data.
   */
  public async cancel(order: Order): Promise<Mutation> {
    order = normalizeOrderIds(order);

    return cancel(this, order);
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
    order = normalizeOrderIds(order);

    return isValidSignature(this, order, claim);
  }

  /**
   * Generates hash from order.
   * @param order Order data.
   */
  public async getOrderDataClaim(order: Order) {
    order = normalizeOrderIds(order);

    return getOrderDataClaim(this, order);
  }

}
