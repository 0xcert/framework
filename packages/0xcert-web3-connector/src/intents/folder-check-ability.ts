import { FolderCheckAbilityRecipe, FolderCheckAbilityResult, FolderCheckAbilityQuery } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Query } from '../core/query';
import { getFolder } from '../utils/contracts';

/**
 * Query class for QueryKind.FOLDER_CHECK_ABILITY.
 * @param connector Connector class instance.
 * @param recipe Query recipe.
 */
export class FolderCheckAbilityIntent extends Web3Query implements FolderCheckAbilityQuery {
  protected recipe: FolderCheckAbilityRecipe;
  protected result: FolderCheckAbilityResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Query recipe.
   */
  public constructor(connector: Connector, recipe: FolderCheckAbilityRecipe) {
    super(connector);
    this.recipe = recipe;
  }

  /**
   * Returns serialized query object.
   */
  public serialize(): FolderCheckAbilityResult {
    return this.result;
  }

  /**
   * Performs query resolver.
   */
  public async resolve(): Promise<this> {
    const { folderId, accountId, abilityKind } = this.recipe;
    const folder = getFolder(this.connector.web3, folderId);

    this.result = await this.exec(async () => {
      return {
        data: {
          isAble: await folder.methods.isAble(accountId, abilityKind).call(),
        },
      };
    });

    return this;
  }

}
