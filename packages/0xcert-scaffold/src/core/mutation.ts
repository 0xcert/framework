import { AssetLedgerBase, GatewayBase, ValueLedgerBase } from '..';

/**
 * Mutation event kinds.
 */
export enum MutationEvent {
  COMPLETE = 'complete',
  CONFIRM = 'confirm',
  ERROR = 'error',
}

/**
 * Mutation context base.
 */
export type MutationContext = AssetLedgerBase | ValueLedgerBase | GatewayBase;

/**
 * Mutation interface.
 */
export interface MutationBase {

  /**
   * Mutation Id (transaction hash).
   */
  id: string;

  /**
   * Number of confirmations (blocks in blockchain after mutation is accepted) are necessary to mark a mutation complete.
   */
  confirmations: number;

  /**
   * Id(address) of the sender.
   */
  senderId: string;

  /**
   * Id(address) of the receiver.
   */
  receiverId: string;

  /**
   * Mutation logs.
   */
  logs: any[];

  /**
   * Checks if mutation in pending.
   */
  isPending(): boolean;

  /**
   * Checks if mutation has reached the required number of confirmation.
   */
  isCompleted(): boolean;

  /**
   * Event emmiter.
   */
  emit(event: MutationEvent.CONFIRM, mutation: MutationBase): this;
  emit(event: MutationEvent.COMPLETE, mutation: MutationBase): this;
  emit(event: MutationEvent.ERROR, error: any): this;

  /**
   * Attaches on mutation events.
   */
  on(event: MutationEvent.CONFIRM, handler: (m: MutationBase) => any): this;
  on(event: MutationEvent.COMPLETE, handler: (m: MutationBase) => any): this;
  on(event: MutationEvent.ERROR, handler: (e: any, m: MutationBase) => any): this;

  /**
   * Once handler.
   */
  once(event: MutationEvent.CONFIRM, handler: (m: MutationBase) => any): this;
  once(event: MutationEvent.COMPLETE, handler: (m: MutationBase) => any): this;
  once(event: MutationEvent.ERROR, handler: (e: any, m: MutationBase) => any): this;

  /**
   * Detaches from mutation events.
   */
  off(event: MutationEvent, handler?: () => any): this;

  /**
   * Waits until mutation is resolved (mutation reaches the specified number of confirmations).
   */
  complete(): Promise<this>;

  /**
   * Resolves current mutation status.
   */
  resolve(): Promise<this>;

  /**
   * Stops listening for confirmations.
   */
  forget(): this;
}
