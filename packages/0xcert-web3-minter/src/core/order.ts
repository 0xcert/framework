import { MinterOrderBase, MinterOrderRecipe, MinterOrderRecipeInput, MinterOrderDataInput } from "@0xcert/scaffold";
import { Context } from "@0xcert/web3-context";

/**
 * 
 */
export class MinterOrder implements MinterOrderBase {
  readonly context: Context;
  public claim: string;
  public signature: string;
  public recipe: MinterOrderRecipe;

  /**
   * 
   */
  public constructor(context: Context) {
    this.context = context;
  }

  /**
   * 
   */
  public populate(data: MinterOrderDataInput) {
    if (data && data.claim !== undefined) {
      this.claim = data.claim;
    }

    if (data && data.signature !== undefined) {
      this.signature = data.signature;
    }

    if (data && data.recipe !== undefined) {
      const asset = {
        proof: '',
        ...data.recipe.asset,
      };
      const recipe = {
        makerId: this.context.makerId,
        takerId: this.context.makerId,
        transfers: [],
        seed: Date.now(),
        expiration: Date.now() + 60 * 60 * 1000,
        ...data.recipe,
        asset,
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
  public async build(recipe: MinterOrderRecipeInput) {
    this.populate({ recipe, signature: null });

    let temp = '0x0';
    for(const transfer of this.recipe.transfers) {
      temp = this.context.web3.utils.soliditySha3(
        { t: 'bytes32', v: temp },
        transfer['ledgerId'],
        transfer['assetId'] ? 1 : 0,
        transfer.senderId,
        transfer.receiverId,
        transfer['assetId'] || transfer['amount'],
      );
    } 

    this.claim = this.context.web3.utils.soliditySha3(
      this.context.minterId,
      this.recipe.makerId,
      this.recipe.takerId,
      this.recipe.asset.ledgerId,
      this.recipe.asset.assetId,
      this.recipe.asset.proof,
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
    this.signature = await this.context.sign(this.claim);

    return this;
  }

}
