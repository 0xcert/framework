import { TransactionBase, TransactionState, TransactionEvent, TransactionEmitter,
  ConnectorError, ErrorCode } from '@0xcert/connector';
import { parseError } from './errors';
import { Context } from './context';

/**
 * 
 */
export class Transaction extends TransactionEmitter implements TransactionBase {
  readonly id: string;
  readonly context: Context;
  protected state: TransactionState = TransactionState.INITIALIZED;
  protected subscription: any;

  /**
   * 
   */
  public constructor(id: string, context: Context) {
    super();
    this.id = id;
    this.context = context;
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
      this.emit(TransactionEvent.ERROR, new ConnectorError(ErrorCode.TRANSACTION_INTERUPTED));
    }
    return this;
  }

  /**
   *
   */
  protected subscribe() {
    this.subscription = this.context.web3.eth.subscribe('newBlockHeaders');

    this.subscription.on('data', async (block) => {
      this.context.web3.eth.getTransaction(this.id, (error, transaction) => {
        if (error || !transaction) {
          this.state = TransactionState.ERROR;
          this.complete();
          this.emit(TransactionEvent.ERROR, !transaction ? new ConnectorError(ErrorCode.TRANSACTION_FAILED) : parseError(error));
          return;
        }
        const confirmations = block.number - transaction.blockNumber;
        if (confirmations >= this.context.confirmations) {
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
