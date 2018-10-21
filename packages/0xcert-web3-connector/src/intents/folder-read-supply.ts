import { FolderReadSupplyRecipe, FolderReadSupplyResult, FolderReadSupplyQuery } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Query } from '../core/query';
import { getFolder } from '../utils/contracts';

/**
 * Query class for QueryKind.FOLDER_CHECK_ABILITY.
 * @param connector Connector class instance.
 * @param recipe Query recipe.
 */
export class FolderReadSupplyIntent extends Web3Query implements FolderReadSupplyQuery {
  protected recipe: FolderReadSupplyRecipe;
  protected result: FolderReadSupplyResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Query recipe.
   */
  public constructor(connector: Connector, recipe: FolderReadSupplyRecipe) {
    super(connector);
    this.recipe = recipe;
  }

  /**
   * Returns serialized query object.
   */
  public serialize(): FolderReadSupplyResult {
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
          totalCount: await folder.methods.totalSupply().call().then((s) => parseInt(s)),
        },
      };
    });

    return this;
  }

}
