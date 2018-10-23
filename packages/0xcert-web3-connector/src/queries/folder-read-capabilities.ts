import { FolderReadCapabilitiesRecipe, FolderReadCapabilitiesResult, FolderReadCapabilitiesQuery } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Query } from '../core/query';
import { getFolder } from '../utils/contracts';

/**
 * Query class for QueryKind.FOLDER_CHECK_ABILITY.
 * @param connector Connector class instance.
 * @param recipe Query recipe.
 */
export class FolderReadCapabilitiesIntent extends Web3Query implements FolderReadCapabilitiesQuery {
  protected recipe: FolderReadCapabilitiesRecipe;
  protected result: FolderReadCapabilitiesResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Query recipe.
   */
  public constructor(connector: Connector, recipe: FolderReadCapabilitiesRecipe) {
    super(connector);
    this.recipe = recipe;
  }

  /**
   * Returns serialized query object.
   */
  public serialize() {
    return this.result;
  }

  /**
   * Performs query resolver.
   */
  public async resolve() {
    const { folderId } = this.recipe;
    const folder = getFolder(this.connector.web3, folderId);

    this.result = await this.exec(async () => {
      return {
        data: {
          isBurnable: await folder.methods.supportsInterface('0x42966c68').call(),
          isMutable: await folder.methods.supportsInterface('0x33b641ae').call(),
          isPausable: await folder.methods.supportsInterface('0xbedb86fb').call(),
          isRevokable: await folder.methods.supportsInterface('0x20c5429b').call(),
        },
      };
    });

    return this;
  }

}
