/**
 * Mutation event kinds.
 */
export enum MutationEvent {
  COMPLETE = 'complete',
  CONFIRM = 'confirm',
  ERROR = 'error',
}

/**
 * Mutation interface.
 */
export interface MutationBase {
  id: string;
  confirmations: number;
  senderId: string;
  receiverId: string;
  isPending(): boolean;
  isCompleted(): boolean;
  emit(event: MutationEvent.CONFIRM, mutation: MutationBase): this;
  emit(event: MutationEvent.COMPLETE, mutation: MutationBase): this;
  emit(event: MutationEvent.ERROR, error: any): this;
  on(event: MutationEvent.CONFIRM, handler: (m: MutationBase) => any): this;
  on(event: MutationEvent.COMPLETE, handler: (m: MutationBase) => any): this;
  on(event: MutationEvent.ERROR, handler: (e: any, m: MutationBase) => any): this;
  once(event: MutationEvent.CONFIRM, handler: (m: MutationBase) => any): this;
  once(event: MutationEvent.COMPLETE, handler: (m: MutationBase) => any): this;
  once(event: MutationEvent.ERROR, handler: (e: any, m: MutationBase) => any): this;
  off(event: MutationEvent, handler?: () => any): this;
  complete(): Promise<this>;
  forget(): this;
}
