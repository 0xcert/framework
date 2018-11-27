import { OrderGatewayBase, Order, OrderActionKind, OrderAction } from '@0xcert/scaffold';
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { toTuple, toFloat, toInteger, toSeconds, toString } from '@0xcert/utils';
import { soliditySha3, padLeft } from './utils';
import gatewayAbi from '../config/gatewayAbi';

/**
 * 
 */
export class OrderGateway /*implements OrderGatewayBase*/ {
  protected provider: GenericProvider;
  readonly id: string;

  /**
   * 
   */
  public constructor(provider: GenericProvider, id: string) {
    this.provider = provider;
    this.id = id;
  }

  /**
   * 
   */
  public async claim(order) {
    const message = this.createOrderHash(order);

    return this.provider.sign({ message });
  }

  /**
   * 
   */
  public async perform(order: Order, claim: string) {
    const recipeTuple = this.createRecipeTuple(order);
    const signatureTuple = this.createSignatureTuple(claim);

    return this.provider.mutateContract({
      to: this.id,
      abi: gatewayAbi.find((a) => a.name === 'perform'),
      data: [recipeTuple, signatureTuple],
    });
  }

  /**
   * 
   */
  public async cancel(order: Order) {
    const recipeTuple = this.createRecipeTuple(order);

    return this.provider.mutateContract({
      to: this.id,
      abi: gatewayAbi.find((a) => a.name === 'cancel'),
      data: [recipeTuple],
    });
  }

  /**
   * 
   */
  protected createRecipeTuple(order: Order) {

    const actions = order.actions.map((action) => {
      return {
        kind: this.getHashKind(action),
        proxy: this.getHashProxy(action),
        token: toString(action.ledgerId),
        param1: this.getHashParam1(action),
        to: toString(action.receiverId),
        value: this.getHashValue(action),
      };
    });

    const recipeData = {
      from: toString(order.makerId),
      to: toString(order.takerId),
      actions,
      seed: toInteger(order.seed),
      expirationTimestamp: toSeconds(order.expiration),
    };

    return toTuple(recipeData);
  }

  /**
   * 
   */
  protected createSignatureTuple(claim: string) {
    const [kind, signature] = claim.split(':');

    const signatureData = {
      r: signature.substr(0, 66),
      s: `0x${signature.substr(66, 64)}`,
      v: parseInt(`0x${signature.substr(130, 2)}`),
      kind,
    };

    if(signatureData.v < 27) {
      signatureData.v = signatureData.v + 27;
    }

    return toTuple(signatureData);
  }

  /**
   * 
   */
  protected createOrderHash(order: Order) {

    let temp = '0x0';
    for(const action of order.actions) {
      temp = soliditySha3(
        { t: 'bytes32', v: temp },
        { t: 'uint8', v: this.getHashKind(action) },
        { t: 'uint32', v: this.getHashProxy(action) },
        toString(action.ledgerId),
        this.getHashParam1(action),
        toString(action.receiverId),
        this.getHashValue(action),
      );
    }
    
    return soliditySha3(
      this.id,
      toString(order.makerId),
      toString(order.takerId),
      temp,
      toInteger(order.seed),
      toSeconds(order.expiration)
    );
  }

  /**
   * 
   */
  protected getHashKind(action: OrderAction) {
    return action.kind === OrderActionKind.CREATE_ASSET ? 0 : 1;
  }

  /**
   * 
   */
  protected getHashProxy(action: OrderAction) {
    if (action.kind === OrderActionKind.TRANSFER_VALUE) {
      return 1;
    }
    else if (action.kind === OrderActionKind.TRANSFER_ASSET) {
      return 3; // TODO if safeTransfer not supported set to 2
    }
    else {
      return 0;
    }
  }

  /**
   * 
   */
  protected getHashParam1(action: OrderAction) {
    return action.kind === OrderActionKind.CREATE_ASSET
      ? action['assetProof']
      : padLeft(toString(action.senderId), 64);
  }

  /**
   * 
   */
  protected getHashValue(action: OrderAction) {
    return action['assetId'] || toFloat(action['value']);
  }

}
