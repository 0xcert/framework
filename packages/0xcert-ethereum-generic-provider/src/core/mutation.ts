import { normalizeAddress } from '@0xcert/ethereum-utils';
import { MutationBase, MutationContext, MutationEvent } from '@0xcert/scaffold';
import { EventEmitter } from 'events';
import { MutationEventSignature, MutationEventTypeKind } from './types';

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
   * Context.
   */
  protected _context?: any;

  /**
   * Mutations logs.
   */
  protected _logs: any[] = [];

  /**
   * Initialize mutation.
   * @param provider Provider class with which we communicate with blockchain.
   * @param id Smart contract address on which a mutation will be performed.
   * @param context Mutation context.
   */
  public constructor(provider: any, id: string, context?: MutationContext) {
    super();

    this._id = id;
    this._provider = provider;
    if (this._provider.sandbox) {
      this._status = MutationStatus.COMPLETED;
    }
    this._context = context;
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
   * Gets mutation logs.
   */
  public get logs() {
    return this._logs;
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
      return this.resolveCurrentState();
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
        this.loopUntilCompleted();
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
   * Resolves mutation with its current data.
   */
  public async resolve() {
    return this.resolveCurrentState();
  }

  /**
   * Retries mutation with a higher gas price if possible. It uses the provider's retryGasMultiplier to
   * calculate gas price.
   * @notice Returns error if a mutation is already accepted onto the blockchain.
   */
  public async retry() {
    const tx = await this.getTransactionObject();
    if (!tx) {
      throw new Error('Mutation not found');
    } else if (tx.blockNumber) {
      throw new Error('Mutation already accepted onto the blockchain');
    }

    const gasPrice = await this._provider.post({
      method: 'eth_gasPrice',
      params: [],
    });
    const oldGasPrice = tx.gasPrice;
    const retryGasPrice = gasPrice.result * this._provider.retryGasPriceMultiplier;
    // We first calculate new gas price based on current network conditions and
    // retryGasPriceMultiplier if calculated gas price is lower than the original gas price, then we
    // use the retryGasPriceMultiplier with the original gas price.
    const newGasPrice = retryGasPrice >= oldGasPrice ? retryGasPrice : oldGasPrice * this._provider.retryGasPriceMultiplier;
    const attrs = {
      from: tx.from,
      data: tx.input,
      nonce: tx.nonce,
      value: tx.value,
      gas: tx.gas,
      gasPrice: `0x${Math.ceil(newGasPrice).toString(16)}`,
    };
    if (tx.to) {
      attrs['to'] = tx.to;
    }
    const res = await this._provider.post({
      method: 'eth_sendTransaction',
      params: [attrs],
    });
    this._id = res.result;
  }

  /**
   * Cancels mutation if possible.
   * @notice Returns error if a mutation is already accepted onto the blockchain or if you are not the
   * mutation maker.
   */
  public async cancel() {
    const tx = await this.getTransactionObject();
    if (!tx) {
      throw new Error('Mutation not found');
    } else if (tx.blockNumber) {
      throw new Error('Mutation already accepted onto the blockchain');
    } else if (tx.from.toLowerCase() !== this._provider.accountId.toLowerCase()) {
      throw new Error('You are not the maker of this mutation so you cannot cancel it.');
    }

    const newGasPrice = `0x${Math.ceil(tx.gasPrice * 1.1).toString(16)}`;
    const attrs = {
      from: tx.from,
      to: tx.from,
      nonce: tx.nonce,
      value: '0x0',
      gasPrice: newGasPrice,
    };
    const res = await this._provider.post({
      method: 'eth_sendTransaction',
      params: [attrs],
    });
    this._id = res.result;
  }

  /**
   * Helper method that resolves current mutation status.
   */
  protected async resolveCurrentState() {
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
        await this.parseLogs();
        this._status = MutationStatus.COMPLETED;
        return this.emit(MutationEvent.COMPLETE, this); // success
      } else {
        this.emit(MutationEvent.CONFIRM, this);
      }
    }
  }

  /**
   * Helper methods for waiting until mutation is completed.
   * IMPORTANT: After submiting a transaction to the Ethereum network, the
   * transaction can not be found for some seconds. This happens because the
   * Ethereum nodes in a cluster are not in sync and we must wait some time for
   * this to happen.
   */
  protected async loopUntilCompleted() {
    await this.resolveCurrentState();
    if (this._provider.mutationTimeout === -1 || Date.now() - this._started < this._provider.mutationTimeout) {
      this._timer = setTimeout(this.loopUntilCompleted.bind(this), this._speed);
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

  /**
   * Parses transaction receipt logs.
   */
  protected async parseLogs() {
    try {
      this._logs = [];
      const eventSignatures: MutationEventSignature[] = this._context.getContext();
      if (!eventSignatures) {
        return;
      }
      const transactionReceipt = await this.getTransactionReceipt();
      transactionReceipt.logs.forEach((log) => {
        const eventSignature = eventSignatures.find((e) => e.topic === log.topics[0]);
        if (!eventSignature) {
          this._provider.log(JSON.stringify(log));
          return;
        }
        const obj = {};
        obj['event'] = eventSignature.name;
        obj['address'] = log.address;
        const normal = eventSignature.types.filter((t) => t.kind === MutationEventTypeKind.NORMAL);
        const indexed = eventSignature.types.filter((t) => t.kind === MutationEventTypeKind.INDEXED);
        if (normal.length > 0) {
          const normalTypes = normal.map((n) => n.type);
          const decoded = this._provider.encoder.decodeParameters(normalTypes, log.data);
          normal.forEach((n, idx) => {
            obj[n.name] = decoded[idx];
          });
        }
        indexed.forEach((i, idx) => {
          obj[i.name] = this._provider.encoder.decodeParameters([i.type], log.topics[idx + 1])[0];
        });
        this._logs.push(obj);
      });
    } catch (e) {
      this._provider.log(e);
    }
  }

}
