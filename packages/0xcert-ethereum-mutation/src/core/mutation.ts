import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { MutationEmitter } from './emitter';
import { MutationEvent } from './types';

/**
 * 
 */
export class Mutation extends MutationEmitter {
  public id: string;
  public confirmations: number = 0;
  protected provider: GenericProvider;
  protected timer: any = null;
  protected done: boolean = false;

  /**
   * 
   */
  public constructor(provider: GenericProvider, id: string) {
    super();

    this.provider = provider;
    this.id = id;
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
