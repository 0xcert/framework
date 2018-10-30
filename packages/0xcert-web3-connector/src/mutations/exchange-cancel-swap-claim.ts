import { ExchangeCancelSwapClaimRecipe, ExchangeCancelSwapClaimMutation } from '@0xcert/connector';
import { Connector, ProxyKind } from '../core/connector';
import { Web3Transaction } from '../core/transaction';
import { getMinter, getAccount, getExchange } from '../utils/contracts';
import { Web3Mutation } from '../core/mutation';
import tuple from '../utils/tuple';

/**
 * Mutation class for.
 */
export class ExchangeCancelSwapClaimIntent extends Web3Mutation implements ExchangeCancelSwapClaimMutation {
  protected recipe: ExchangeCancelSwapClaimRecipe;
  protected transaction: Web3Transaction;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Mutation recipe.
   */
  public constructor(connector: Connector, recipe: ExchangeCancelSwapClaimRecipe) {
    super(connector);
    this.recipe = recipe;
  }

  /**
   * Returns serialized mutation object.
   * If mutationId is null then the mutation has not yet been resolved.
   */
  public serialize() {
    /*return {
      mutationId: this.transaction.transactionHash,
      data: this.recipe.data,
    };*/
    return null;
  }

  /**
   * Performs the resolve operation.
   */
  public async resolve() {
    const exchange = getExchange(this.connector.web3, this.connector.config.exchangeAddress);
    const from = await getAccount(this.connector.web3, this.recipe.data.data.makerId);

    const transfers = [];

    this.recipe.data.data.transfers.forEach((transfer) => {
      transfers.push({
        token: transfer['folderId'] || transfer['vaultId'],
        proxy: transfer['assetId'] ? ProxyKind.NF_TOKEN_TRANSFER_PROXY : ProxyKind.TOKEN_TRANSFER_PROXY,
        from: transfer['senderId'],
        to: transfer['receiverId'],
        value: transfer['assetId'] || transfer['amount'],
      });
    });

    const swapData = {
      from: this.recipe.data.data.makerId,
      to: this.recipe.data.data.takerId,
      transfers,
      seed: this.recipe.data.data.seed,
      expirationTimestamp: this.recipe.data.data.expiration,
    }
    const swapDataTuple = tuple(swapData);
  
    const resolver = () => {
      return exchange.methods.cancelSwap(swapDataTuple).send({ from });
    };

    return this.exec(this.recipe.mutationId, resolver);
  }
}
