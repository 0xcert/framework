import { GenericProviderBase, Mutation } from '@0xcert/scaffold';
import { EventEmitter } from 'events';

/**
 * 
 */
export enum MutationEvent {
  CONFIRM = 'confirm',
  COMPLETE = 'complete',
  REMOVE = 'remove',
  TICK = 'tick',
}

/**
 * 
 */
export class MutationTracker extends EventEmitter {
  public transactions: {[key: string]: number} = {};
  protected provider: GenericProviderBase;
  protected timer = null;
  protected running = false;

  /**
   * 
   * @param provider GenericProvider instance.
   */
  public constructor(provider: GenericProviderBase) {
    super();
  
    this.provider = provider;
  }

  /**
   * 
   */
  public on(event: MutationEvent, handler: ((m: Mutation) => any)) {
    return super.on(event, handler);
  }

  /**
   * 
   */
  public off(event?: MutationEvent, handler?: ((m: Mutation) => any)) {
    if (handler) {
      return super.off(event, handler);
    }
    else {
      return super.removeAllListeners(event);
    }
  }

  /**
   * 
   */
  public isRunning() {
    return this.running;
  }

  /**
   * 
   */
  public add(...txids: string[]) {
    txids.forEach((id) => {
      if (typeof this.transactions[id] === 'undefined') {
        this.transactions[id] = 0;
      }
    });

    return this;
  }

  /**
   * 
   */
  public remove(...txids: string[]) {
    txids.forEach((id) => {
      delete this.transactions[id];
    });

    return this;
  }

    /**
   * 
   */
  public async check(id: string) {
    return this.provider.getMutation(id);
  }

  /**
   * 
   */
  public clear() {
    this.transactions = {};

    return this;
  }

  /**
   * 
   */
  public start() {
    this.running = true;
    this.loop(0);

    return this;
  }

  /**
   * 
   */
  public stop() {
    this.running = false;
    this.suspend();

    return this;
  }

  /**
   * 
   */
  public async tick() {
    this.emit('tick');

    for (const tx in this.transactions) {
      const mutation = await this.provider.getMutation(tx);
      const confirmations = this.transactions[tx];

      if (!mutation) {
        this.emit('remove', { id: tx, confirmations: 0 });
      }
      else if (!confirmations || mutation.confirmations > confirmations) {
        this.transactions[tx] = mutation.confirmations;
        this.emit('confirm', mutation);
      }

      if (mutation.confirmations >= 2) {
        this.emit('complete', mutation);
        delete this.transactions[tx];
      }
    }

    this.loop(5000);
  }

  /**
   * 
   * @param delay Number of milliseconds.
   */
  protected loop(delay: number) {
    this.suspend();
    this.timer = setTimeout(this.tick.bind(this), delay);
  }

  /**
   * 
   */
  protected suspend() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

}
