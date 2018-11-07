import { Order } from "@0xcert/order";
import { Mutation, ContextBase } from "./context";

/**
 * 
 */
export interface OrderExchangeBase {
  readonly platform: string;
  readonly context: ContextBase;
  claim(order: Order): Promise<string>;
  perform(order: Order, claim: string): Promise<Mutation>;
  cancel(order: Order): Promise<Mutation>;
}
