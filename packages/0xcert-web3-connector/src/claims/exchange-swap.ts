import { Connector } from '../core/connector';
import { ExchangeSwapRecipe, ExchangeSwapClaim } from '@0xcert/connector/dist/core/claim';
import { Web3Claim } from '../core/claim';

/**
 * Mutation class for.
 */
export class ExchangeSwapGenerator extends Web3Claim {
  protected recipe: ExchangeSwapRecipe;

  /**
   * Class constructor.
   * @param connector Connector class instance.
   * @param recipe Mutation recipe.
   */
  public constructor(connector: Connector, recipe: ExchangeSwapRecipe) {
    super(connector);
    this.recipe = recipe;
  }

  /**
   * 
   */
  public generate(): ExchangeSwapClaim {
    let temp = '0x0';
    for(const transfer of this.recipe.transfers) {
      temp = this.connector.web3.utils.soliditySha3(
        { t: 'bytes32', v: temp },
        transfer['folderId'] || transfer['vaultId'],
        this.connector.config.nftTransferProxyAddress,
        transfer.senderId,
        transfer.receiverId,
        transfer['assetId'] || transfer['amount'],
      );
    }
  
    const data = this.connector.web3.utils.soliditySha3(
      this.connector.config.minterAddress,
      this.recipe.makerId,
      this.recipe.takerId,
      temp,
      this.recipe.seed || Date.now(), // seed
      Math.floor(this.recipe.expiration / 1000) // expires
    );

    const signature = this.sign(data, this.connector.config.signatureKind, this.recipe.makerId);

    return { data, signature };
  }

}
