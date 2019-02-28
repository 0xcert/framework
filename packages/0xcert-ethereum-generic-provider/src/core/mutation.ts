import { normalizeAddress } from '@0xcert/ethereum-utils/dist/lib/normalize-address';
import { MutationBase, MutationEvent } from '@0xcert/scaffold';
import { EventEmitter } from 'events';

/**
 * Possible mutation statuses.
 */
export enum MutationStatus {
  INITIALIZED = 0,
  PENDING = 1,
  COMPLETED = 2,
}

/**
 * Ethreum transaction mutation.
 */
export class Mutation extends EventEmitter implements MutationBase {

  /**
   * Mutation Id (transaction hash).
   */
  protected _id: string;

  /**
   * Number of confirmations (blocks in blockchain after mutation is accepted) are necessary to mark a mutation complete.
   */
  protected _confirmations = 0;

  /**
   * Id (address) of the sender.
   */
  protected _senderId: string;

  /**
   * Id (address) of the receiver.
   */
  protected _receiverId: string;

  /**
   * Provider instance.
   */
  protected _provider: any;

  /**
   * Completion process heartbeat speed.
   */
  protected _speed = 14000;

  /**
   * Completion process loop timer.
   */
  protected _timer: any;

  /**
   * Completion process start timestamp.
   */
  protected _started: number;

  /**
   * Current mutation status.
   */
  protected _status: MutationStatus = MutationStatus.INITIALIZED;

  /**
   * Initialize mutation.
   * @param provider Provider class with which we comunicate with blockchain.
   * @param id Smart contract address on which a mutation will be performed.
   */
  public constructor(provider: any, id: string) {
    super();

    this._id = id;
    this._provider = provider;
  }

  /**
   * Gets smart contract address.
   */
  public get id() {
    return this._id;
  }

  /**
   * Get provider intance.
   */
  public get provider() {
    return this._provider;
  }

  /**
   * Gets the number of confirmations of mutation.
   */
  public get confirmations() {
    return this._confirmations;
  }

  /**
   * Gets the sending address.
   */
  public get senderId() {
    return this._senderId;
  }

  /**
   * Gets the receiving address.
   */
  public get receiverId() {
    return this._receiverId;
  }

  /**
   * Checks if mutation in pending.
   */
  public isPending() {
    return this._status === MutationStatus.PENDING;
  }

  /**
   * Checks if mutation has reached the required number of confirmation.
   */
  public isCompleted() {
    return this._status === MutationStatus.COMPLETED;
  }

  /**
   * Emits mutation event.
   */
  public emit(event: MutationEvent.CONFIRM, mutation: Mutation);
  public emit(event: MutationEvent.COMPLETE, mutation: Mutation);
  public emit(event: MutationEvent.ERROR, error: any);
  public emit(...args) {
    super.emit.call(this, ...args);
    return this;
  }

  /**
   * Attaches on mutation events.
   */
  public on(event: MutationEvent.CONFIRM, handler: (m: Mutation) => any);
  public on(event: MutationEvent.COMPLETE, handler: (m: Mutation) => any);
  public on(event: MutationEvent.ERROR, handler: (e: any, m: Mutation) => any);
  public on(...args) {
    super.on.call(this, ...args);
    return this;
  }

  /**
   * Once handler.
   */
  public once(event: MutationEvent.CONFIRM, handler: (m: Mutation) => any);
  public once(event: MutationEvent.COMPLETE, handler: (m: Mutation) => any);
  public once(event: MutationEvent.ERROR, handler: (e: any, m: Mutation) => any);
  public once(...args) {
    super.once.call(this, ...args);
    return this;
  }

  /**
   * Dettaches from mutation events.
   */
  public off(event: MutationEvent.ERROR, handler: (e: any, m: Mutation) => any);
  public off(event: MutationEvent);
  public off(event, handler?) {
    if (handler) {
      super.off(event, handler);
    } else {
      super.removeAllListeners(event);
    }
    return this;
  }

  /**
   * Waits until mutation is resolved (mutation reaches the specified number of confirmations).
   */
  public async complete() {
    const start = this._status === MutationStatus.INITIALIZED;

    if (this.isCompleted()) {
      return this;
    } else if (!this.isPending()) {
      this._status = MutationStatus.PENDING;
      this._started = Date.now();
    }

    await new Promise((resolve, reject) => {
      if (!this.isCompleted()) {
        this.once(MutationEvent.COMPLETE, () => resolve());
        this.once(MutationEvent.ERROR, (err) => reject(err));
      } else {
        resolve();
      }
      if (start) {
        this.loopUntilResolved();
      }
    });

    return this;
  }

  /**
   * Stops listening for confirmations.
   */
  public forget() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }

    return this;
  }

  /**
   * Helper methods for waiting to resolve mutation.
   * IMPORTANT: After submiting a transaction to the Ethereum network, the
   * transaction can not be found for some seconds. This happens because the
   * Ethereum nodes in a cluster are not in sync and we must wait some time for
   * this to happen.
   */
  protected async loopUntilResolved() {
    const tx = await this.getTransactionObject();
    if (tx && (!tx.to || tx.to === '0x0')) {
      tx.to = await this.getTransactionReceipt().then((r) => r ? r.contractAddress : null);
    }
    if (tx && tx.to) {
      this._senderId = normalizeAddress(tx.from);
      this._receiverId = normalizeAddress(tx.to);
      this._confirmations = await this.getLastBlock()
        .then((lastBlock) => lastBlock - parseInt(tx.blockNumber || lastBlock))
        .then((num) => num < 0 ? 0 : num); // -1 when pending transaction is moved to the next block.

      if (this._confirmations >= this._provider.requiredConfirmations) {
        this._status = MutationStatus.COMPLETED;
        return this.emit(MutationEvent.COMPLETE, this); // success
      } else {
        this.emit(MutationEvent.CONFIRM, this);
      }
    }
    if (this._provider.mutationTimeout === -1 || Date.now() - this._started < this._provider.mutationTimeout) {
      this._timer = setTimeout(this.loopUntilResolved.bind(this), this._speed);
    } else {
      this.emit(MutationEvent.ERROR, new Error('Mutation has timed out'));
    }
  }

  /**
   * Gets transaction data.
   */
  protected async getTransactionObject() {
    const res = await this._provider.post({
      method: 'eth_getTransactionByHash',
      params: [this.id],
    });
    return res.result;
  }

  /**
   * Gets transaction receipt.
   */
  protected async getTransactionReceipt() {
    const res = await this._provider.post({
      method: 'eth_getTransactionReceipt',
      params: [this.id],
    });
    return res.result;
  }

  /**
   * Gets the latest block number.
   */
  protected async getLastBlock() {
    const res = await this._provider.post({
      method: 'eth_blockNumber',
    });
    return parseInt(res.result);
  }

}
