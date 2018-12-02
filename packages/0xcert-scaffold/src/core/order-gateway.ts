import { Order } from "./order";
import { MutationBase } from "./misc";

/**
 * 
 */
export interface OrderGatewayBase {
  readonly id: string;
  claim(order: Order): Promise<string>;
  perform(order: Order, claim: string): Promise<MutationBase>;
  cancel(order: Order): Promise<MutationBase>;
}
