import { GenericProvider, Mutation } from '@0xcert/ethereum-generic-provider';
import { OrderGatewayBase, Order } from '@0xcert/scaffold';
import { normalizeAddress } from '@0xcert/ethereum-utils';
import claim from '../queries/claim';
import cancel from '../mutations/cancel';
import perform from '../mutations/perform';

/**
 * 
 */
export class OrderGateway implements OrderGatewayBase {
  protected $id: string;
  protected $provider: GenericProvider;

  /**
   * 
   */
  public constructor(provider: GenericProvider, id: string) {
    this.$id = normalizeAddress(id);
    this.$provider = provider;
  }
  
  /**
   * 
   */
  public get id() {
    return this.$id;
  }

  /**
   * 
   */
  public get provider() {
    return this.$provider;
  }

  /**
   * 
   */
  public async claim(order): Promise<string> {
    return claim(this, order);
  }

  /**
   * 
   */
  public async perform(order: Order, claim: string): Promise<Mutation> {
    return perform(this, order, claim);
  }

  /**
   * 
   */
  public async cancel(order: Order): Promise<Mutation> {
    return cancel(this, order);
  }

}
