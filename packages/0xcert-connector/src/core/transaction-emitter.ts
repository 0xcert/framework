import { EventEmitter } from "eventemitter3";
import { ConnectorError } from "./connector-error";

/**
 * 
 */
export enum TransactionEvent {
  CONFIRMATION = 'confirmation',
  APPROVAL = 'approval',
  ERROR = 'error',
}

/**
 * 
 */
export abstract class TransactionEmitter extends EventEmitter {

  /**
   * 
   */
  public on(event: TransactionEvent.CONFIRMATION, handler: (count: number, transaction: this) => any);
  public on(event: TransactionEvent.APPROVAL, handler: (count: number, transaction: this) => any);
  public on(event: TransactionEvent.ERROR, handler: (error: ConnectorError, transaction: this) => any);
  public on(event, handler) {
    return super.on(event, handler);
  }

  /**
   * 
   */
  public once(event: TransactionEvent.CONFIRMATION, handler: (count: number, transaction: this) => any);
  public once(event: TransactionEvent.APPROVAL, handler: (count: number, transaction: this) => any);
  public once(event: TransactionEvent.ERROR, handler: (error: ConnectorError, transaction: this) => any);
  public once(event, handler) {
    return super.on(event, handler);
  }

  /**
   * 
   */
  public off(event: TransactionEvent.CONFIRMATION, handler?: (count: number, transaction: this) => any);
  public off(event: TransactionEvent.APPROVAL, handler?: (count: number, transaction: this) => any);
  public off(event: TransactionEvent.ERROR, handler?: (error: ConnectorError, transaction: this) => any);
  public off(event, handler) {
    return super.off(event, handler);
  }

  /**
   * 
   */
  public emit(event: TransactionEvent.CONFIRMATION, count: number);
  public emit(event: TransactionEvent.APPROVAL, count: number);
  public emit(event: TransactionEvent.ERROR, error: ConnectorError);
  public emit(event, ...args) {
    return super.emit(event, ...args);
  }

}
