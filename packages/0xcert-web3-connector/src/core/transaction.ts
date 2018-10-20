import { EventEmitter } from 'eventemitter3';
import * as Web3 from 'web3';

/**
 * Web3 transaction executor configuration.
 */
export interface Web3TransactionConfig {
  web3: Web3;
  approvalConfirmationsCount?: number;
  transactionHash?: string;
  resolver: () => any;
}

/**
 * Web3 transaction executor for safe transaction execution on the Ethereum
 * network with hydration support.
 */
export class Web3Transaction extends EventEmitter {
  protected config: Web3TransactionConfig;
  protected subscription: any;
  protected resolved: boolean;
  protected approved: boolean;

  /**
   * Class constructor.
   * @param config Web3 performer configuration.
   */
  public constructor(config: Web3TransactionConfig) {
    super();

    this.config = {
      approvalConfirmationsCount: 15,
      transactionHash: null,
      ...config,
    };
  }
 
  /**
   * Returns transaction hash.
   */
  public get transactionHash() {
    return this.config.transactionHash;
  }

  /**
   * Returns approval confirmations count.
   */
  public get approvalConfirmationsCount() {
    return this.config.approvalConfirmationsCount;
  }

  /**
   * Tells if the transaction has been approved.
   */
  public isApproved() {
    return this.approved;
  }

  /**
   * Tells if the transaction has been resolved.
   */
  public isResolved() {
    return this.resolved;
  }

  /**
   * Tells if the transaction is mining.
   */
  public isResolving() {
    return !!this.subscription;
  }

  /**
   * Start resolver operation. It's safe to call this method multiple times.
   */
  public perform() {
    if (!this.resolved && !this.subscription) {
      this.startSubscription();

      if (!this.config.transactionHash) {
        this.startTransaction();
      }
    }
    return this;
  }

  /**
   * Aborts activity by throwing an error. It's safe to call this method
   * multiple times.
   */
  public detach() {
    if (!this.resolved && this.subscription) {
      this.markResolved();
      this.emit('detach');
    }
    return this;
  }

  /**
   * Waits until the resolver operation is approved. It's safe to call this 
   * method multiple times.
   */
  public async resolve() {
    if (this.resolved || !this.subscription) {
      return this;
    }
    return new Promise((resolve, reject) => {
      this.once('detach', resolve);
      this.once('approval', resolve);
      this.once('error', reject);
    }).then(() => this);
  }

    /**
   * Stops subscriptions and marks this class as resolved.
   */
  protected markResolved() {
    if (this.subscription) {
      this.resolved = true;
      this.subscription.unsubscribe();
    }
    return this;
  }

  /**
   * Starts watching resolvert transaction state.
   */
  protected startSubscription() {
    this.subscription = this.config.web3.eth.subscribe('newBlockHeaders');

    this.subscription.on('data', async (block) => {
      if (!this.config.transactionHash) {
        return;
      }
      this.config.web3.eth.getTransaction(this.config.transactionHash, (error, transaction) => {
        if (error || !transaction) {
          this.markResolved();
          this.emit('error', !transaction ? 'removed' : error);
          return;
        }
        const blockDiff = block.number - transaction.blockNumber;
        if (blockDiff >= this.config.approvalConfirmationsCount) {
          this.markResolved();
          this.approved = true;
          this.emit('approval', blockDiff);
        } else {
          this.emit('confirmation', blockDiff);
        }
      });
    });
    this.subscription.once('error', (error) => {
      this.markResolved();
      this.emit('error', error);
    });
  }

  /**
   * Executes the resolver and starts the transaction.
   */
  protected startTransaction() {
    const transaction = this.config.resolver();

    this.emit('request');

    transaction.once('transactionHash', (hash) => {
      this.config.transactionHash = hash;
      this.emit('response');
    });
    transaction.once('error', (error) => {
      this.markResolved();
      this.emit('error', error);
    });
}

}
