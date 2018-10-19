import { FolderCheckTransferStateRecipe, FolderCheckTransferStateResult } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Query } from '../core/query';

/**
 * Query class for QueryKind.FOLDER_CHECK_ABILITY.
 * @param connector Connector class instance.
 * @param recipe Query recipe.
 */
export class FolderCheckTransferStateQuery extends Web3Query {
  protected recipe: FolderCheckTransferStateRecipe;
  protected result: FolderCheckTransferStateResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Query recipe.
   */
  public constructor(connector: Connector, recipe: FolderCheckTransferStateRecipe) {
    super(connector, recipe);
  }

  /**
   * Performs query resolver.
   */
  public async resolve(): Promise<this> {
    const { folderId } = this.recipe;
    const folder = this.getFolder(folderId);

    this.result = {
      isEnabled: await folder.methods.isPaused().call(),
    };

    return this;
  }

}
