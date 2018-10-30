import { Connector, ProxyKind } from '../core/connector';
import { ExchangeSwapRecipe, ExchangeSwapClaim } from '@0xcert/connector/dist/core/claim';
import { Web3Claim } from '../core/claim';

/**
 * Mutation class for.
 */
export class ExchangeSwapGenerator extends Web3Claim implements ExchangeSwapClaim {
  protected recipe: ExchangeSwapRecipe;
  protected data: string;
  protected signature: string;

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
  public generate() {
    let temp = '0x0';

    for(const transfer of this.recipe.transfers) {
      temp = this.connector.web3.utils.soliditySha3(
        { t: 'bytes32', v: temp },
        transfer['folderId'] || transfer['vaultId'],
        transfer['assetId'] ? ProxyKind.NF_TOKEN_TRANSFER_PROXY : ProxyKind.TOKEN_TRANSFER_PROXY,
        transfer.senderId,
        transfer.receiverId,
        transfer['assetId'] || transfer['amount'],
      );
    }

    const data = this.connector.web3.utils.soliditySha3(
      this.connector.config.exchangeAddress,
      this.recipe.makerId,
      this.recipe.takerId,
      temp,
      this.recipe.seed || Date.now(), // seed
      this.recipe.expiration // expires
    );

    this.data = data;
    return this;
  }

  /**
   * 
   */
  public async sign() {
    this.signature = await this.createSignature(this.data, this.connector.config.signatureKind, this.recipe.makerId);
    return this;
  }

  /**
   * 
   */
  public serialize() {
     return { claim: this.data, signature: this.signature, data: this.recipe };
  }
}
