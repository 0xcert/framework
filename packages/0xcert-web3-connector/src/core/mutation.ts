import { MutationBase, MutationRecipe, MutationResult, MutationWatcher, MutationEvent } from '@0xcert/connector';
import { Connector } from './connector';
import * as env from '../config/env';
import { EventEmitter } from 'events';

/**
 * Abstract Web3 mutation class.
 */
export abstract class Web3Mutation extends EventEmitter implements MutationBase {
  protected connector: Connector;
  protected recipe: MutationRecipe;
  protected result: MutationResult;
  protected resolved: boolean;
  protected subscription: any;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Mutation recipe.
   */
  public constructor(connector: Connector, recipe: MutationRecipe) {
    super();
    this.connector = connector;
    this.recipe = { ...recipe };
  }

  /**
   * Returns serialized mutation data.
   */
  public serialize(): MutationResult {
    return this.result;
  }

  /**
   * Performs mutation resolver.
   * NOTE: This method should be overriden!
   */
  public async resolve(): Promise<this> {
    throw 'Not implemented!';
  }

  /**
   * Emits revert event.
   * @param error Error object.
   */
  protected emitRevert(error) {
    this.resolved = true;
    this.subscription.unsubscribe();
    this.emit('revert', error);
  }

  /**
   * Emits approval event.
   * @param count Number of confirmations.
   */
  protected emitApproval(count: number) {
    this.resolved = true;
    this.emit('approval', count);
  }

  /**
   * Emits confirmation event.
   * @param count Number of confirmations.
   */
  protected emitConfirmation(count: number) {
    this.resolved = false;
    this.emit('confirmation', count);
  }

  /**
   * Start resolver.
   */
  protected async perform(resolver: Function) {
    if (this.resolved) {
      return this;
    } else if (!this.subscription) {
      this.performWatch();
      this.performTransaction(resolver);
    }

    return new Promise((resolve, reject) => {
      this.once('approval', resolve);
      this.once('revert', reject);
    });
  }

  /**
   * Starts watching resolvert transaction state.
   */
  protected async performWatch() {
    this.subscription = this.connector.web3.eth.subscribe('newBlockHeaders');

    this.subscription.on('data', async (block) => {
      if (!this.recipe.mutationHash) {
        return;
      }
      this.connector.web3.eth.getTransaction(this.recipe.mutationHash, (error, transaction) => {
        if (error) {
          return this.emitRevert(error);
        } else if (transaction === null) {
          return this.emitRevert('failed');
        }
        const blockDiff = block.number - transaction.blockNumber;
        if (blockDiff > this.connector.requiredConfirmationsCount) {
          return this.emitApproval(blockDiff);
        } else {
          return this.emitConfirmation(blockDiff);
        }
      });
    });
    this.subscription.once('error', (error) => {
      return this.emitRevert(error);
    });
  }

  /**
   * Starts resolver transaction.
   * @param resolver Function which returns transaction object.
   */
  protected async performTransaction(resolver: Function) {
    const transaction = resolver(this);

    transaction.once('transactionHash', (hash) => {
      this.recipe.mutationHash = hash;
    });
    transaction.once('error', (error) => {
      return this.emitRevert(error);
    });
  }

  /**
   * Returns Xcert smart contract instance.
   */
  protected getFolder(folderId: string) {
    return new this.connector.web3.eth.Contract(env.xcertAbi, folderId);
  }

  /**
   * Returns the provided accountId
   */
  protected async getAccount(accountId?: string) {
    return accountId ? accountId : await this.connector.web3.eth.getAccounts().then((a) => a[0]);
  }

}
