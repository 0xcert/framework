import { FolderReadSupplyRecipe, FolderReadSupplyResult } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Query } from '../core/query';

/**
 * Query class for QueryKind.FOLDER_CHECK_ABILITY.
 * @param connector Connector class instance.
 * @param recipe Query recipe.
 */
export class FolderReadSupplyQuery extends Web3Query {
  protected recipe: FolderReadSupplyRecipe;
  protected result: FolderReadSupplyResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Query recipe.
   */
  public constructor(connector: Connector, recipe: FolderReadSupplyRecipe) {
    super(connector, recipe);
  }

  /**
   * Performs query resolver.
   */
  public async resolve(): Promise<this> {
    const { folderId } = this.recipe;
    const folder = this.getFolder(folderId);

    this.result = {
      totalCount: await folder.methods.totalSupply().call().then((s) => parseInt(s)),
    };

    return this;
  }

}
