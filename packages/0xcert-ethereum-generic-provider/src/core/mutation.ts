import { EventEmitter } from 'events';
import { MutationBase } from '@0xcert/scaffold';
import { normalizeAddress } from '@0xcert/ethereum-utils';
import { MutationEvent } from './types';

/**
 * 
 */
export class Mutation extends EventEmitter implements MutationBase {
  protected $id: string;
  protected $confirmations: number = 0;
  protected $senderId: string;
  protected $receiverId: string;
  protected $provider: any;
  protected $timer: any = null;
  protected $done: boolean = false;

  /**
   * 
   */
  public constructor(provider: any, id: string) {
    super();

    this.$provider = provider;
    this.id = id;
  }

  /**
   * 
   */
  public get id() {
    return this.$id;
  }

  /**
   * 
   */
  public get confirmations() {
    return this.$confirmations;
  }

  /**
   * 
   */
  public get senderId() {
    return this.$senderId;
  }

  /**
   * 
   */
  public get receiverId() {
    return this.$receiverId;
  }

  /**
   * 
   */
  public set id(id) {
    this.$id = normalizeAddress(id);
  }

  /**
   * 
   */
  public set senderId(id) {
    this.$senderId = normalizeAddress(id);
  }

  /**
   * 
   */
  public set receiverId(id) {
    this.$receiverId = normalizeAddress(id);
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
    if (this.$done) {
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
    if (this.$timer) {
      clearTimeout(this.$timer);
    }

    return this;
  }

  /**
   * 
   */
  protected async loopUntilResolved() {
    const tx = await this.getTransactionObject();
    if (!tx) {
      return this.emit(MutationEvent.ERROR, new Error('Mutation not found (1)'));
    }
    else if (!tx.to) {
      const receipt = await this.getTransactionReceipt();
      if (!receipt) {
        return this.emit(MutationEvent.ERROR, new Error('Mutation not found (2)'));
      }
      tx.to = receipt.contractAddress;  
    }
    this.senderId = tx.from;
    this.receiverId = tx.to;

    const block = await this.getLastBlock();
    if (!block) {
      return this.emit(MutationEvent.ERROR, new Error('Mutation not found (3)'));
    }
    
    this.$confirmations = parseInt(block.number) - parseInt(tx.blockNumber);
    if (this.confirmations >= 25) {
      this.$done = true;
      this.emit(MutationEvent.RESOLVE, this);
    }
    else {
      this.emit(MutationEvent.CONFIRM, this);
      this.$timer = setTimeout(this.loopUntilResolved.bind(this), 14000);
    }
  }

  /**
   * 
   */
  protected async getTransactionObject() {
    const res = await this.$provider.send({
      method: 'eth_getTransactionByHash',
      params: this.id,
    });
    return res.result;
  }

  /**
   * 
   */
  protected async getTransactionReceipt() {
    const res = await this.$provider.send({
      method: 'eth_getTransactionReceipt',
      params: this.id,
    });
    return res.result;
  }

  /**
   * 
   */
  protected async getLastBlock() {
    const res = await this.$provider.send({
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
    });
    return res.result;
  }

}
