import { OrderBase, OrderRecipe } from "@0xcert/connector";
import { SignatureMethod, Signature } from "@0xcert/web3-utils";
import { getMinter } from '../utils/contracts';
import { performMutate } from './intents';
import tuple from '../utils/tuple';

/**
 * 
 */
export interface OrderConfig {
  web3: any;
  makerId: string;
  minterId: string;
  signatureMethod: SignatureMethod;
}

/**
 * 
 */
export class Order implements OrderBase {
  public recipe: OrderRecipe;
  public claim: string;
  public signature: string;
  protected config: OrderConfig;

  /**
   * 
   */
  public constructor(config: OrderConfig) {
    this.config = config;
  }

  /**
   * 
   */
  public async compile(recipe: OrderRecipe) {
    this.recipe = recipe;

    let temp = '0x0';
    for(const transfer of this.recipe.transfers) {
      temp = this.config.web3.utils.soliditySha3(
        { t: 'bytes32', v: temp },
        transfer['folderId'] || transfer['vaultId'],
        transfer['assetId'] ? 1 : 0,
        transfer.senderId,
        transfer.receiverId,
        transfer['assetId'] || transfer['amount'],
      );
    } 

    this.claim = this.config.web3.utils.soliditySha3(
      this.config.minterId,
      this.config.makerId,
      this.recipe.takerId,
      this.recipe.asset.folderId,
      this.recipe.asset.assetId,
      this.recipe.asset.proof,
      temp,
      this.recipe.seed || Date.now(), // seed
      this.recipe.expiration // expires
    );
    this.signature = null;

    return this;
  }

  /**
   * 
   */
  public async sign() {
    this.signature = await new Signature({
      web3: this.config.web3,
      data: this.recipe,
      makerId: this.config.makerId,
    }).sign(this.config.signatureMethod);

    return this;
  }

  /**
   * 
   */
  public async perform(signatureA: string) {
    const minter = getMinter(this.config.web3, this.config.minterId);
    const from = await this.recipe.takerId;

    const xcertData = {
      xcert: this.recipe.asset.folderId,
      id: this.recipe.asset.assetId,
      proof: this.recipe.asset.proof,
    };

    const transfers = this.recipe.transfers.map((transfer) => {
      return {
        token: transfer['folderId'] || transfer['vaultId'],
        proxy: transfer['assetId'] ? 1 : 0,
        from: transfer['senderId'],
        to: transfer['receiverId'],
        value: transfer['assetId'] || transfer['amount'],
      };
    });

    const mintData = {
      from: this.config.makerId,
      to: this.recipe.takerId,
      xcertData,
      transfers,
      seed: this.recipe.seed,
      expirationTimestamp: this.recipe.expiration,
    };

    const mintTuple = tuple(mintData);
  
    const [kind, signature] = signatureA.split(':');
    const signatureTuple = tuple({
      r: signature.substr(0, 66),
      s: `0x${signature.substr(66, 64)}`,
      v: parseInt(`0x${signature.substr(130, 2)}`) + 27,
      kind
    });

    return performMutate(() => {
      return minter.methods.performMint(mintTuple, signatureTuple).send({ from });
    });
  }

  /**
   * 
   */
  public serialize() {
    return {
      recipe: this.recipe,
      claim: this.claim,
      signature: this.signature,
    };
  }

}
