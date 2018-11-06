import { Mutation, ContextBase } from "./context";

/**
 * 
 */
export interface OrderExchangeBase {
  readonly platform: string;
  readonly context: ContextBase;
  perform(order): Promise<Mutation>;
  cancel(order): Promise<Mutation>;
}
