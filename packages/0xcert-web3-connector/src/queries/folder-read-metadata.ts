import { FolderReadMetadataRecipe, FolderReadMetadataResult } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Query } from '../core/query';

/**
 * Query class for QueryKind.FOLDER_CHECK_ABILITY.
 * @param connector Connector class instance.
 * @param recipe Query recipe.
 */
export class FolderReadMetadataQuery extends Web3Query {
  protected recipe: FolderReadMetadataRecipe;
  protected result: FolderReadMetadataResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Query recipe.
   */
  public constructor(connector: Connector, recipe: FolderReadMetadataRecipe) {
    super(connector, recipe);
  }

  /**
   * Performs query resolver.
   */
  public async resolve(): Promise<this> {
    const { folderId } = this.recipe;
    const folder = this.getFolder(folderId);

    this.result = {
      name: await folder.methods.name().call(),
      symbol: await folder.methods.symbol().call(),
    };

    return this;
  }

}
