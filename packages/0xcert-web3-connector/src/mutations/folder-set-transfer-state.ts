import { FolderSetTransferStateRecipe, FolderSetTransferStateResult, MutationBase } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Intent } from '../core/intent';
import { Web3Transaction } from '../core/transaction';

/**
 * Mutation class for MutationKind.FOLDER_SET_TRANSFER_STATE.
 */
export class FolderSetTransferStateMutation extends Web3Intent implements MutationBase {
  protected recipe: FolderSetTransferStateRecipe;
  protected result: FolderSetTransferStateResult;
  protected transaction: Web3Transaction;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Mutation recipe.
   */
  public constructor(connector: Connector, recipe: FolderSetTransferStateRecipe) {
    super(connector);

    this.recipe = recipe;

    this.transaction = new Web3Transaction({
      web3: connector.web3,
      transactionHash: recipe.mutationHash,
      resolver: this.onResolve.bind(this),
      confirmationsCount: connector.approvalConfirmationsCount,
    });
    this.transaction.on('request', () => this.onRequest.bind(this));
    this.transaction.on('response', () => this.onResponse.bind(this));
    this.transaction.on('confirmation', () => this.onConfirmation.bind(this));
    this.transaction.on('approval', () => this.onApproval.bind(this));
    this.transaction.on('error', () => this.onError.bind(this));
  }

  /**
   * 
   */
  public serialize() {
    return {
      isEnabled: true,
    };
  }

  /**
   * Performs the resolve operation.
   */
  public async resolve(): Promise<any> {
    await this.transaction.perform().resolve();

    return this;
  }

  /**
   * Performs the resolve operation.
   */
  protected async onResolve(): Promise<any> {
    const folder = this.getFolder(this.recipe.folderId);
    const from = await this.getAccount(this.recipe.makerId);

    return folder.methods.setPause(true).send({ from });
  }

  /**
   * Triggered transaction is sent to the network.
   */
  protected onRequest() {
    this.emit('request', this);
  }  

  /**
   * Triggered transaction hash is received.
   */
  protected onResponse() {
    this.emit('response', this);
  }

  /**
   * Triggered on each transaction confirmation.
   * @param count Number of confirmations.
   */
  protected onConfirmation(count) {
    this.emit('confirmation', this, count);
  }

  /**
   * Triggered when the transaction is approved.
   */
  protected onApproval(count) {
    this.transaction.removeAllListeners();
    this.emit('approval', this, count);
  }

  /**
   * Triggered on each error.
   */
  protected onError() {
    // this.emit('error', this);
  }

}
