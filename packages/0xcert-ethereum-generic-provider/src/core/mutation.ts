import { EventEmitter } from 'events';
import { MutationEvent } from './types';

/**
 * 
 */
export class Mutation extends EventEmitter {
  public id: string;
  public confirmations: number = 0;
  protected provider: any;
  protected timer: any = null;
  protected done: boolean = false;

  /**
   * 
   */
  public constructor(provider: any, id: string) {
    super();

    this.provider = provider;
    this.id = id;
  }

    /**
   * 
   */
  public emit(event: MutationEvent.CONFIRM, mutation: Mutation);
  public emit(event: MutationEvent.RESOLVE, mutation: Mutation);
  public emit(event: MutationEvent.ERROR, error: any);
  public emit(...args) {
    return super.emit.call(this, ...args);
  }

  /**
   * 
   */
  public on(event: MutationEvent.CONFIRM, handler: (m: Mutation) => any);
  public on(event: MutationEvent.RESOLVE, handler: (m: Mutation) => any);
  public on(event: MutationEvent.ERROR, handler: (e: any) => any);
  public on(...args) {
    return super.on.call(this, ...args);
  }

  /**
   * 
   */
  public once(event: MutationEvent.CONFIRM, handler: (m: Mutation) => any);
  public once(event: MutationEvent.RESOLVE, handler: (m: Mutation) => any);
  public once(event: MutationEvent.ERROR, handler: (e: any) => any);
  public once(...args) {
    return super.once.call(this, ...args);
  }

  /**
   * 
   */
  public off(event: MutationEvent, handler?: () => any) {
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
  public async resolve() {
    if (this.done) {
      return this;
    }

    return new Promise((resolve, reject) => {
      this.once(MutationEvent.RESOLVE, () => resolve(this));
      this.once(MutationEvent.ERROR, (err) => reject(err));
      this.loopUntilResolved();
    });
  }

  /**
   * 
   */
  public forget() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    return this;
  }

  /**
   * 
   */
  protected async loopUntilResolved() {
    const tx = await this.provider.getTransactionByHash(this.id);
    if (!tx) {
      return this.emit(MutationEvent.ERROR, new Error('Mutation not found (1)'));
    }

    const block = await this.provider.getBlockByNumber('latest');
    if (!block) {
      return this.emit(MutationEvent.ERROR, new Error('Mutation not found (2)'));
    }
    
    this.confirmations = block.number - tx.blockNumber;
    if (this.confirmations >= 25) {
      this.done = true;
      this.emit(MutationEvent.RESOLVE, this);
    }
    else {
      this.emit(MutationEvent.CONFIRM, this);
      this.timer = setTimeout(this.loopUntilResolved.bind(this), 14000);
    }
  }

}
