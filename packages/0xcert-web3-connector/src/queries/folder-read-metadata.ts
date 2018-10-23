import { FolderReadMetadataRecipe, FolderReadMetadataResult, FolderReadMetadataQuery } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Query } from '../core/query';
import { getFolder } from '../utils/contracts';

/**
 * Query class for QueryKind.FOLDER_CHECK_ABILITY.
 * @param connector Connector class instance.
 * @param recipe Query recipe.
 */
export class FolderReadMetadataIntent extends Web3Query implements FolderReadMetadataQuery {
  protected recipe: FolderReadMetadataRecipe;
  protected result: FolderReadMetadataResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Query recipe.
   */
  public constructor(connector: Connector, recipe: FolderReadMetadataRecipe) {
    super(connector);
    this.recipe = recipe;
  }

  /**
   * Returns serialized query object.
   */
  public serialize(): FolderReadMetadataResult {
    return this.result;
  }

  /**
   * Performs query resolver.
   */
  public async resolve(): Promise<this> {
    const { folderId } = this.recipe;
    const folder = getFolder(this.connector.web3, folderId);

    this.result = await this.exec(async () => {
      return {
        data: {
          name: await folder.methods.name().call(),
          symbol: await folder.methods.symbol().call(),
        },
      };
    });

    return this;
  }

}
