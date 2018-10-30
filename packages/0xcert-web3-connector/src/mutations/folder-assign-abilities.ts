import { FolderAssignAbilitiesRecipe, FolderAssignAbilitiesMutation } from '@0xcert/connector';
import { Connector } from '../core/connector';
import { Web3Transaction } from '../core/transaction';
import { getFolder, getAccount } from '../utils/contracts';
import { Web3Mutation } from '../core/mutation';

/**
 * Mutation class for.
 */
export class FolderAssignAbilitiesIntent extends Web3Mutation implements FolderAssignAbilitiesMutation {
  protected recipe: FolderAssignAbilitiesRecipe;
  protected transaction: Web3Transaction;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Mutation recipe.
   */
  public constructor(connector: Connector, recipe: FolderAssignAbilitiesRecipe) {
    super(connector);
    this.recipe = recipe;
  }

  /**
   * Returns serialized mutation object.
   * If mutationId is null then the mutation has not yet been resolved.
   */
  public serialize() {
    return {
      mutationId: this.transaction.transactionHash,
      data: this.recipe.data,
    };
  }

  /**
   * Performs the resolve operation.
   */
  public async resolve() {
    const folder = getFolder(this.connector.web3, this.recipe.folderId);
    const from = await getAccount(this.connector.web3, this.recipe.makerId);
    const target = this.recipe.data.target;
    const abilities = this.recipe.data.abilities;

    const resolver = () => {
      return folder.methods.assignAbilities(target, abilities).send({ from });
    };

    return this.exec(this.recipe.mutationId, resolver);
  }
}
