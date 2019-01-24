import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { normalizeAddress } from '@0xcert/ethereum-utils';
import { Order, OrderGatewayBase } from '@0xcert/scaffold';
import cancel from '../mutations/cancel';
import perform from '../mutations/perform';
import claim from '../queries/claim';
import getOrderDataClaim from '../queries/get-order-data-claim';
import getProxyAccountId from '../queries/get-proxy-account-id';
import isValidSignature from '../queries/is-valid-signature';
import { OrderGatewayProxy } from './types';

/**
 * Ethereum order gateway implementation.
 */
export class OrderGateway implements OrderGatewayBase {
  protected $id: string;
  protected $provider: GenericProvider;

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
    this.$id = normalizeAddress(id || provider.orderGatewayId);
    this.$provider = provider;
  }

  /**
   * Gets the address of the smart contract that represents this order gateway.
   */
  public get id() {
    return this.$id;
  }

  /**
   * Gets the provider that is used to comunicate with blockchain.
   */
  public get provider() {
    return this.$provider;
  }

  /**
   * Gets signed claim for an order.
   * @param order Order data.
   */
  public async claim(order: Order): Promise<string> {
    return claim(this, order);
  }

  /**
   * Performs an order.
   * @param order Order data.
   * @param claim Claim data.
   */
  public async perform(order: Order, claim: string): Promise<Mutation> {
    return perform(this, order, claim);
  }

  /**
   * Cancels an order.
   * @param order Order data.
   */
  public async cancel(order: Order): Promise<Mutation> {
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
    return isValidSignature(this, order, claim);
  }

  /**
   * Generates hash from order.
   * @param order Order data.
   */
  public async getOrderDataClaim(order: Order) {
    return getOrderDataClaim(this, order);
  }
}
