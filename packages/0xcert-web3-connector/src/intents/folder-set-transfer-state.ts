import { FolderSetTransferStateRecipe, FolderSetTransferStateResult, FolderSetTransferStateMutation } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Transaction } from '../core/transaction';
import { getFolder, getAccount } from '../utils/contracts';
import { Web3Mutation } from '../core/mutation';

/**
 * Mutation class for.
 */
export class FolderSetTransferStateIntent extends Web3Mutation implements FolderSetTransferStateMutation {
  protected recipe: FolderSetTransferStateRecipe;
  protected transaction: Web3Transaction;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Mutation recipe.
   */
  public constructor(connector: Connector, recipe: FolderSetTransferStateRecipe) {
    super(connector);
    this.recipe = recipe;
  }

  /**
   * Returns serialized mutation object.
   */
  public serialize() {
    return {
      mutationId: this.transaction.transactionHash,
      data: {
        isEnabled: true,
      },
    };
  }

  /**
   * Performs the resolve operation.
   */
  public async resolve() {
    const folder = getFolder(this.connector.web3, this.recipe.folderId);
    const from = await getAccount(this.connector.web3, this.recipe.makerId);

    const resolver = () => {
      return folder.methods.setPause(true).send({ from });
    };

    return this.exec(this.recipe.mutationId, resolver);
  }

}
