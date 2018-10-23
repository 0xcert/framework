import { ExchangePerformSwapClaimRecipe, ExchangePerformSwapClaimMutation } from '@0xcert/connector';
import { Connector, ProxyKind } from '../core/connector';
import { Web3Transaction } from '../core/transaction';
import { getMinter, getAccount } from '../utils/contracts';
import { Web3Mutation } from '../core/mutation';
import tuple from '../utils/tuple';

/**
 * Mutation class for.
 */
export class ExchangePerformSwapClaimIntent extends Web3Mutation implements ExchangePerformSwapClaimMutation {
  protected recipe: ExchangePerformSwapClaimRecipe;
  protected transaction: Web3Transaction;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Mutation recipe.
   */
  public constructor(connector: Connector, recipe: ExchangePerformSwapClaimRecipe) {
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
    const minter = getMinter(this.connector.web3, this.connector.config.minterAddress);
    const from = await getAccount(this.connector.web3, this.recipe.data.data.takerId);

    const transfers = [];

    for(let transfer in this.recipe.data.data.transfers)
    {
      transfers.push({
        token: transfer['folderId'] || transfer['vaultId'],
        proxy: transfer['assetId'] ? ProxyKind.NF_TOKEN_TRANSFER_PROXY : ProxyKind.TOKEN_TRANSFER_PROXY,
        from: transfer['senderId'],
        to: transfer['receiverId'],
        value: transfer['assetId'] || transfer['amount'],
      });
    }

    const swapData = {
      from: this.recipe.data.data.makerId,
      to: this.recipe.data.data.takerId,
      transfers,
      seed: this.recipe.data.data.seed,
      expirationTimestamp: this.recipe.data.data.expiration,
    }
    const swapDataTuple = tuple(swapData);
  
    const [kind, signature] = this.recipe.data.signature.split(':');
    const signatureData = {
      r: signature.substr(0, 66),
      s: `0x${signature.substr(66, 64)}`,
      v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
      kind,
    };
    const signatureDataTuple = tuple(signatureData);

    const resolver = () => {
      return minter.methods.swap(swapDataTuple, signatureDataTuple).send({ from });
    };

    return this.exec(this.recipe.mutationId, resolver);
  }
}
