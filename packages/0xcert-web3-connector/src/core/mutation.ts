import { MutationBase, MutationRecipe, MutationResult } from '@0xcert/connector';
import { Connector } from './connector';
import { Web3Intent } from './intent';
import { Web3Transaction } from './transaction';

/**
 * Abstract Web3 mutation class.
 */
export abstract class Web3Mutation extends Web3Intent {
  protected connector: Connector;
  protected recipe: MutationRecipe;
  protected transaction: Web3Transaction;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Mutation recipe.
   */
  public constructor(connector: Connector, recipe: MutationRecipe) {
    super(connector);

    this.recipe = { ...recipe };

    this.transaction = new Web3Transaction({
      web3: connector.web3,
      transactionHash: recipe.mutationHash,
      resolver: this['resolve'] ? this['resolve'].bind(this) : null,
      confirmationsCount: connector.approvalConfirmationsCount,
    });
  }

}
