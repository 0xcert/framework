import { FolderSetTransferStateRecipe, FolderSetTransferStateResult } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Mutation } from '../core/mutation';

/**
 * Mutation class for MutationKind.FOLDER_SET_TRANSFER_STATE.
 */
export class FolderSetTransferStateMutation extends Web3Mutation {
  protected recipe: FolderSetTransferStateRecipe;
  protected result: FolderSetTransferStateResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Mutation recipe.
   */
  public constructor(connector: Connector, recipe: FolderSetTransferStateRecipe) {
    super(connector, recipe);
  }

  /**
   * Performs the resolve operation.
   */
  public async resolve(): Promise<this> {
    const folder = this.getFolder(this.recipe.folderId);
    const from = await this.getAccount(this.recipe.makerId);

    await this.perform(() => {
      return folder.methods.setPause(true).send({ from });
    });

    this.result = {
      isEnabled: await folder.methods.isPaused().call(),
    };

    return this;
  }

}
