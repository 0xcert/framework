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
  protected $id: string;

  /**
   * Number of confirmations (blocks in blockchain after mutation is accepted) are necessary to mark a mutation complete.
   */
  protected $confirmations = 0;

  /**
   * Id(address) of the sender.
   */
  protected $senderId: string;

  /**
   * Id(address) of the receiver.
   */
  protected $receiverId: string;

  /**
   * Provider instance.
   */  
  protected $provider: any;

  /**
   * Timer for checking confirmations.
   */
  protected $timer: any = null;

  /**
   * Current mutation status.
   */
  protected $status: MutationStatus = MutationStatus.INITIALIZED;

  /**
   * Initialize mutation.
   * @param provider Provider class with which we comunicate with blockchain.
   * @param id Smart contract address on which a mutation will be performed.
   */
  public constructor(provider: any, id: string) {
    super();

    this.$id = id;
    this.$provider = provider;
  }

  /**
   * Gets smart contract address.
   */
  public get id() {
    return this.$id;
  }

  /**
   * Get provider intance.
   */
  public get provider() {
    return this.$provider;
  }

  /**
   * Gets the number of confirmations of mutation.
   */
  public get confirmations() {
    return this.$confirmations;
  }

  /**
   * Gets the sending address.
   */
  public get senderId() {
    return this.$senderId;
  }

  /**
   * Gets the receiving address.
   */
  public get receiverId() {
    return this.$receiverId;
  }

  /**
   * Checks if mutation in pending.
   */
  public isPending() {
    return this.$status === MutationStatus.PENDING;
  }

  /**
   * Checks if mutation has reached the required number of confirmation.
   */
  public isCompleted() {
    return this.$status === MutationStatus.COMPLETED;
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
    const start = this.$status === MutationStatus.INITIALIZED;

    if (this.isCompleted()) {
      return this;
    } else {
      this.$status = MutationStatus.PENDING;
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
    if (this.$timer) {
      clearTimeout(this.$timer);
    }

    return this;
  }

  /**
   * Helper methods for waiting to resolve mutation.
   */
  protected async loopUntilResolved() {
    const tx = await this.getTransactionObject();
    if (!tx) {
      return this.emit(MutationEvent.ERROR, new Error('Mutation not found (1)'));
    } else if (!tx.to || tx.to === '0x0') {
      tx.to = await this.getTransactionReceipt().then((r) => r ? r.contractAddress : null);
    }
    if (tx.to) {
      this.$senderId = normalizeAddress(tx.from);
      this.$receiverId = normalizeAddress(tx.to);
      this.$confirmations = await this.getLastBlock()
        .then((lastBlock) => lastBlock - parseInt(tx.blockNumber || lastBlock))
        .then((num) => num < 0 ? 0 : num); // -1 when pending transaction is moved to the next block.

      if (this.$confirmations >= this.$provider.requiredConfirmations) {
        this.$status = MutationStatus.COMPLETED;
        this.emit(MutationEvent.COMPLETE, this);
      } else {
        this.emit(MutationEvent.CONFIRM, this);
        this.$timer = setTimeout(this.loopUntilResolved.bind(this), 14000);
      }
    } else {
      this.$timer = setTimeout(this.loopUntilResolved.bind(this), 14000);
    }
  }

  /**
   * Gets transaction data.
   */
  protected async getTransactionObject() {
    const res = await this.$provider.post({
      method: 'eth_getTransactionByHash',
      params: [this.id],
    });
    return res.result;
  }

  /**
   * Gets transaction receipt.
   */
  protected async getTransactionReceipt() {
    const res = await this.$provider.post({
      method: 'eth_getTransactionReceipt',
      params: [this.id],
    });
    return res.result;
  }

  /**
   * Gets the latest block number.
   */
  protected async getLastBlock() {
    const res = await this.$provider.post({
      method: 'eth_blockNumber',
    });
    return parseInt(res.result);
  }

}
