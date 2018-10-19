import { FolderCheckAbilityRecipe, FolderCheckAbilityResult } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Query } from '../core/query';

/**
 * Query class for QueryKind.FOLDER_CHECK_ABILITY.
 * @param connector Connector class instance.
 * @param recipe Query recipe.
 */
export class FolderCheckAbilityQuery extends Web3Query {
  protected recipe: FolderCheckAbilityRecipe;
  protected result: FolderCheckAbilityResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Query recipe.
   */
  public constructor(connector: Connector, recipe: FolderCheckAbilityRecipe) {
    super(connector, recipe);
  }

  /**
   * Performs query resolver.
   */
  public async resolve(): Promise<this> {
    const { folderId, accountId, abilityKind } = this.recipe;
    const folder = this.getFolder(folderId);

    this.result = {
      isAble: await folder.methods.isAble(accountId, abilityKind).call(),
    };

    return this;
  }

}
