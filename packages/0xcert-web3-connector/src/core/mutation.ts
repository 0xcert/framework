import { MutationEvent } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Transaction } from '../core/transaction';
import { parseError } from './errors';
import { EventEmitter } from 'eventemitter3';

/**
 * Abstract mutation class for running transactions on Ethereum network.
 */
export abstract class Web3Mutation extends EventEmitter {
  protected connector: Connector;
  protected transaction: Web3Transaction;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   */
  public constructor(connector: Connector) {
    super();
    this.connector = connector;
  }

  /**
   * Creates a transaction if the transaction is not initialized, then performs
   * and resolves the transaction on the Ethereum network.
   * @param mutationId Optional transaction hash.
   * @param resolver Mutation resolve function.
   */
  protected async exec(mutationId: string, resolver: () => any) {

    if (!this.transaction) {
      this.transaction = new Web3Transaction({
        web3: this.connector.web3,
        transactionHash: mutationId,
        approvalConfirmationsCount: this.connector.config.approvalConfirmationsCount,
        resolver,
      });
      this.transaction.on('request', () => this.emit(MutationEvent.REQUEST, this));
      this.transaction.on('response', () => this.emit(MutationEvent.RESPONSE, this));
      this.transaction.on('confirmation', (count) => this.emit(MutationEvent.CONFIRMATION, count, this));
      this.transaction.on('approval', (count) => this.emit(MutationEvent.APPROVAL, count, this));
      this.transaction.on('error', (error) => this.emit(MutationEvent.ERROR, parseError(error), this));
    }

    return this.transaction.perform().resolve().then(() => this);
  }

}
