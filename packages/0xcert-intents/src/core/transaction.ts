import { TransactionEvent } from "./events";
import { TransactionError } from "./errors";

/**
 * 
 */
export enum TransactionState {
  INITIALIZED = 0,
  PENDING = 1,
  APPROVED = 2,
  ERROR = 3,
}

/**
 * 
 */
export interface TransactionBase {
  id: string;
  getState(): TransactionState;
  resolve(): Promise<this>;
  interrupt(): this;
  on(event: TransactionEvent.CONFIRMATION, handler: (count: number, transaction: this) => any);
  on(event: TransactionEvent.APPROVAL, handler: (count: number, transaction: this) => any);
  on(event: TransactionEvent.ERROR, handler: (error: TransactionError, transaction: this) => any);
  once(event: TransactionEvent.CONFIRMATION, handler: (count: number, transaction: this) => any);
  once(event: TransactionEvent.APPROVAL, handler: (count: number, transaction: this) => any);
  once(event: TransactionEvent.ERROR, handler: (error: TransactionError, transaction: this) => any);
  off(event: TransactionEvent.CONFIRMATION, handler?: (count: number, transaction: this) => any);
  off(event: TransactionEvent.APPROVAL, handler?: (count: number, transaction: this) => any);
  off(event: TransactionEvent.ERROR, handler?: (error: TransactionError, transaction: this) => any);
  emit(event: TransactionEvent.CONFIRMATION, count: number);
  emit(event: TransactionEvent.APPROVAL, count: number);
  emit(event: TransactionEvent.ERROR, error: TransactionError);
}
