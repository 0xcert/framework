import { MinterPerformCreateAssetClaimRecipe, MinterPerformCreateAssetClaimMutation } from '@0xcert/connector';
import { Connector, ProxyKind } from '../core/connector';
import { Web3Transaction } from '../core/transaction';
import { getMinter, getAccount } from '../utils/contracts';
import { Web3Mutation } from '../core/mutation';
import tuple from '../utils/tuple';

/**
 * Mutation class for.
 */
export class MinterPerformCreateAssetClaimIntent extends Web3Mutation implements MinterPerformCreateAssetClaimMutation {
  protected recipe: MinterPerformCreateAssetClaimRecipe;
  protected transaction: Web3Transaction;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Mutation recipe.
   */
  public constructor(connector: Connector, recipe: MinterPerformCreateAssetClaimRecipe) {
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

    const xcertData = {
      xcert: this.recipe.data.data.asset.folderId,
      id: this.recipe.data.data.asset.assetId,
      proof: this.recipe.data.data.asset.publicProof,
    };
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

    const mintData = {
      from: this.recipe.data.data.makerId,
      to: this.recipe.data.data.takerId,
      xcertData,
      transfers,
      seed: this.recipe.data.data.seed,
      expirationTimestamp: this.recipe.data.data.expiration,
    }
    const mintTuple = tuple(mintData);
  
    const [kind, signature] = this.recipe.data.signature.split(':');
    const signatureData = {
      r: signature.substr(0, 66),
      s: `0x${signature.substr(66, 64)}`,
      v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
      kind,
    };
    const signatureDataTuple = tuple(signatureData);

    const resolver = () => {
      return minter.methods.performMint(mintTuple, signatureDataTuple).send({ from });
    };

    return this.exec(this.recipe.mutationId, resolver);
  }
}
