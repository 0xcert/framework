import { FolderReadCapabilitiesRecipe, FolderReadCapabilitiesResult } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Query } from '../core/query';

/**
 * Query class for QueryKind.FOLDER_CHECK_ABILITY.
 * @param connector Connector class instance.
 * @param recipe Query recipe.
 */
export class FolderReadCapabilitiesQuery extends Web3Query {
  protected recipe: FolderReadCapabilitiesRecipe;
  protected result: FolderReadCapabilitiesResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Query recipe.
   */
  public constructor(connector: Connector, recipe: FolderReadCapabilitiesRecipe) {
    super(connector, recipe);
  }

  /**
   * Performs query resolver.
   */
  public async resolve(): Promise<this> {
    const { folderId } = this.recipe;
    const folder = this.getFolder(folderId);

    this.result = {
      isBurnable: await folder.methods.supportsInterface('0x42966c68').call(),
      isMutable: await folder.methods.supportsInterface('0x33b641ae').call(),
      isPausable: await folder.methods.supportsInterface('0xbedb86fb').call(),
      isRevokable: await folder.methods.supportsInterface('0x20c5429b').call(),
    };

    return this;
  }

}
