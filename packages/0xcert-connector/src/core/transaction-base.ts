import { TransactionEvent } from "./transaction-emitter";
import { TransactionState } from "./transaction-state";
import { ConnectorError } from "./connector-error";

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
  on(event: TransactionEvent.ERROR, handler: (error: ConnectorError, transaction: this) => any);
  once(event: TransactionEvent.CONFIRMATION, handler: (count: number, transaction: this) => any);
  once(event: TransactionEvent.APPROVAL, handler: (count: number, transaction: this) => any);
  once(event: TransactionEvent.ERROR, handler: (error: ConnectorError, transaction: this) => any);
  off(event: TransactionEvent.CONFIRMATION, handler?: (count: number, transaction: this) => any);
  off(event: TransactionEvent.APPROVAL, handler?: (count: number, transaction: this) => any);
  off(event: TransactionEvent.ERROR, handler?: (error: ConnectorError, transaction: this) => any);
  emit(event: TransactionEvent.CONFIRMATION, count: number);
  emit(event: TransactionEvent.APPROVAL, count: number);
  emit(event: TransactionEvent.ERROR, error: ConnectorError);
}
