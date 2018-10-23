import { FolderCheckApprovalRecipe, FolderCheckApprovalResult, FolderCheckApprovalQuery } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Query } from '../core/query';
import { getFolder } from '../utils/contracts';

/**
 * Query class for QueryKind.FOLDER_CHECK_APPROVAL.
 * @param connector Connector class instance.
 * @param recipe Query recipe.
 */
export class FolderCheckApprovalIntent extends Web3Query implements FolderCheckApprovalQuery {
  protected recipe: FolderCheckApprovalRecipe;
  protected result: FolderCheckApprovalResult;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Query recipe.
   */
  public constructor(connector: Connector, recipe: FolderCheckApprovalRecipe) {
    super(connector);
    this.recipe = recipe;
  }

  /**
   * Returns serialized query object.
   */
  public serialize(): FolderCheckApprovalResult {
    return this.result;
  }

  /**
   * Performs query resolver.
   */
  public async resolve(): Promise<this> {
    const { folderId, accountId, assetId } = this.recipe;
    const folder = getFolder(this.connector.web3, folderId);

    const isApprovedForToken = async () => {
      const approvedAddress = await folder.methods.getApproved(assetId).call();
      return approvedAddress === accountId;
    }

    const isApprovedForAll = async () => {
      const assetOwner = await folder.methods.ownerOf(assetId).call();
      return await folder.methods.isApprovedForAll(assetOwner, accountId).call();
    }

    this.result = await this.exec(async () => {
      return {
        data: {
          isApproved: await isApprovedForToken() || await isApprovedForAll(),
        },
      };
    });

    return this;
  }

}
