import { EventEmitter } from 'eventemitter3';
import { TransactionBase, TransactionState, TransactionEvent, TransactionIssue,
  TransactionError } from '@0xcert/intents';
import { parseError } from './errors';

/**
 * 
 */
export interface TransactionConfig {
  id: string;
  web3: any;
  confirmations?: number;
}

/**
 * 
 */
export class Transaction extends EventEmitter implements TransactionBase {
  protected config: TransactionConfig;
  protected state: TransactionState = TransactionState.INITIALIZED;
  protected subscription: any;

  /**
   * 
   */
  public constructor(config: TransactionConfig) {
    super();

    this.config = {
      confirmations: 21,
      ...config,
    };
  }

  /**
   * 
   */
  public get id() {
    return this.config.id;
  }

  /**
   * 
   */
  public getState() {
    return this.state;
  }

  /**
   * 
   */
  public async resolve() {
    if (this.state === TransactionState.APPROVED) {
      return this;
    }
    else if (!this.subscription) {
      this.state = TransactionState.PENDING;
      this.subscribe();
    }
    return new Promise((resolve, reject) => {
      this.once(TransactionEvent.APPROVAL, resolve);
      this.once(TransactionEvent.ERROR, (error) => reject(parseError(error)));
    }).then(() => this);
  }

  /**
   * 
   */
  public interrupt() {
    if (this.state === TransactionState.PENDING) {
      this.state = TransactionState.ERROR;
      this.complete();
      this.emit(TransactionEvent.ERROR, new TransactionError(TransactionIssue.TRANSACTION_INTERUPTED));
    }
    return this;
  }

  /**
   * 
   */
  public on(event: TransactionEvent.CONFIRMATION, handler: (count: number, transaction: this) => any);
  public on(event: TransactionEvent.APPROVAL, handler: (count: number, transaction: this) => any);
  public on(event: TransactionEvent.ERROR, handler: (error: TransactionError, transaction: this) => any);
  public on(event, handler) {
    return super.on(event, handler);
  }

  /**
   * 
   */
  public once(event: TransactionEvent.CONFIRMATION, handler: (count: number, transaction: this) => any);
  public once(event: TransactionEvent.APPROVAL, handler: (count: number, transaction: this) => any);
  public once(event: TransactionEvent.ERROR, handler: (error: TransactionError, transaction: this) => any);
  public once(event, handler) {
    return super.on(event, handler);
  }

  /**
   * 
   */
  public off(event: TransactionEvent.CONFIRMATION, handler?: (count: number, transaction: this) => any);
  public off(event: TransactionEvent.APPROVAL, handler?: (count: number, transaction: this) => any);
  public off(event: TransactionEvent.ERROR, handler?: (error: TransactionError, transaction: this) => any);
  public off(event, handler) {
    return super.off(event, handler);
  }

  /**
   * 
   */
  public emit(event: TransactionEvent.CONFIRMATION, count: number);
  public emit(event: TransactionEvent.APPROVAL, count: number);
  public emit(event: TransactionEvent.ERROR, error: TransactionError);
  public emit(event, ...args) {
    return super.emit(event, ...args);
  }

  /**
   *
   */
  protected subscribe() {
    this.subscription = this.config.web3.eth.subscribe('newBlockHeaders');

    this.subscription.on('data', async (block) => {
      this.config.web3.eth.getTransaction(this.config.id, (error, transaction) => {
        if (error || !transaction) {
          this.state = TransactionState.ERROR;
          this.complete();
          this.emit(TransactionEvent.ERROR, !transaction ? new TransactionError(TransactionIssue.TRANSACTION_FAILED) : parseError(error));
          return;
        }
        const confirmations = block.number - transaction.blockNumber;
        if (confirmations >= this.config.confirmations) {
          this.state = TransactionState.APPROVED;
          this.complete();
          this.emit(TransactionEvent.APPROVAL, confirmations);
        } else {
          this.emit(TransactionEvent.CONFIRMATION, confirmations);
        }
      });
    });

    this.subscription.once('error', (error) => {
      this.state = TransactionState.ERROR;
      this.complete();
      this.emit(TransactionEvent.ERROR, parseError(error));
    });
  }

  /**
   * 
   */
  protected complete() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

}
