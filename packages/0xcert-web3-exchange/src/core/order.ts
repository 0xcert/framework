import { ExchangeOrderBase, ExchangeOrderRecipe, ExchangeOrderRecipeInput,
  ExchangeOrderDataInput } from "@0xcert/scaffold";
import { Connector } from "@0xcert/web3-connector";

/**
 * 
 */
export class ExchangeOrder implements ExchangeOrderBase {
  readonly connector: Connector;
  public claim: string;
  public signature: string;
  public recipe: ExchangeOrderRecipe;

  /**
   * 
   */
  public constructor(connector: Connector) {
    this.connector = connector;
  }

  /**
   * 
   */
  public populate(data: ExchangeOrderDataInput) {
    if (data && data.claim !== undefined) {
      this.claim = data.claim;
    }

    if (data && data.signature !== undefined) {
      this.signature = data.signature;
    }

    if (data && data.recipe !== undefined) {
      const recipe = {
        makerId: this.connector.makerId,
        takerId: this.connector.makerId,
        transfers: [],
        seed: Date.now(),
        expiration: Date.now() + 60 * 60 * 1000,
        ...data.recipe,
      };
      this.recipe = recipe;
    }

    return this;
  }

  /**
   * 
   */
  public serialize() {
    return {
      claim: this.claim,
      signature: this.signature,
      recipe: this.recipe,
    };
  }

  /**
   * 
   */
  public async build(recipe: ExchangeOrderRecipeInput) {
    this.populate({ recipe, signature: null });

    let temp = '0x0';
    for(const transfer of this.recipe.transfers) {
      temp = this.connector.web3.utils.soliditySha3(
        { t: 'bytes32', v: temp },
        transfer['folderId'] || transfer['vaultId'],
        transfer['assetId'] ? 1 : 0,
        transfer.senderId,
        transfer.receiverId,
        transfer['assetId'] || transfer['amount'],
      );
    } 

    this.claim = this.connector.web3.utils.soliditySha3(
      this.connector.exchangeId,
      this.recipe.makerId,
      this.recipe.takerId,
      temp,
      this.recipe.seed || Date.now(), // seed
      this.recipe.expiration // expires
    );

    return this;
  }

  /**
   * 
   */
  public async sign() {
    this.signature = await this.connector.sign(this.claim);

    return this;
  }

}
