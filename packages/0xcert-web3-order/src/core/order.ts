import { OrderBase, OrderInput, OrderAction } from "@0xcert/scaffold";
import { Context } from "@0xcert/web3-context";

/**
 * 
 */
export class Order implements OrderBase {
  readonly platform: string = 'web3';
  readonly context: Context;
  public makerId: string;
  public takerId: string;
  public actions: OrderAction[] = [];
  public seed: number;
  public expiration: number;
  public signature: string;
  public claim: string;

  /**
   * 
   */
  public constructor(context: Context) {
    this.context = context;
  }

  /**
   * 
   */
  public populate(data: OrderInput) {
    this.makerId = data.makerId !== undefined ? data.makerId : this.makerId;
    this.takerId = data.takerId !== undefined ? data.takerId : this.takerId;
    this.actions = this.actions;
    this.seed = this.seed ? this.seed : Date.now();
    this.expiration = this.expiration || Date.now();
    this.signature = data.signature;

    return this;
  }

  /**
   * 
   */
  public serialize() {
    return {
      makerId: this.makerId,
      takerId: this.takerId,
      actions: this.actions,
      seed: this.seed,
      expiration: this.expiration,
      signature: this.signature,
    };
  }

  /**
   * 
   */
  public async sign() {
    await this.build();

    this.signature = await this.context.sign(this.claim);

    return this;
  }

  /**
   * 
   */
  public async build() {

    let temp = '0x0';
    for(const action of this.actions) {
      temp = this.context.web3.utils.soliditySha3(
        { t: 'bytes32', v: temp },
        action['kind'],
        action['ledgerId'],
        // action['assetId'] ? 1 : 0,
        // action.senderId,
        // action.receiverId,
        // action['assetId'] || action['value'],
      );
    } 

    this.claim = this.context.web3.utils.soliditySha3(
      this.context.exchangeId,
      this.makerId,
      this.takerId,
      temp,
      this.seed || Date.now(), // seed
      this.expiration // expires
    );

    return this;
  }

}
