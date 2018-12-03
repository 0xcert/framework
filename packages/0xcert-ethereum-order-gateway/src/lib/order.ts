import { OrderAction, OrderActionKind, Order } from '@0xcert/scaffold';
import { toInteger, toSeconds, toTuple } from '@0xcert/utils';
import { padLeft, soliditySha3 } from '@0xcert/ethereum-utils';
import { OrderGateway } from '../core/gateway';

/**
 * 
 */
export function createOrderHash(gateway: OrderGateway, order: Order) {
  let temp = '0x0';

  for (const action of order.actions) {
    temp = soliditySha3(
      { t: 'bytes32', v: temp },
      { t: 'uint8', v: getActionKind(action) },
      { t: 'uint32', v: getActionProxy(gateway, action) },
      action.ledgerId,
      getActionParam1(action),
      action.receiverId,
      getActionValue(action),
    );
  }
  
  return soliditySha3(
    gateway.id,
    order.makerId,
    order.takerId,
    temp,
    toInteger(order.seed),
    toSeconds(order.expiration)
  );
}

/**
 * 
 */
export function createRecipeTuple(gateway: OrderGateway, order: Order) {

  const actions = order.actions.map((action) => {
    return {
      kind: getActionKind(action),
      proxy: getActionProxy(gateway, action),
      token: action.ledgerId,
      param1: getActionParam1(action),
      to: action.receiverId,
      value: getActionValue(action),
    };
  });

  const recipeData = {
    from: order.makerId,
    to: order.takerId,
    actions,
    seed: toInteger(order.seed),
    expirationTimestamp: toSeconds(order.expiration),
  };

  return toTuple(recipeData);
}

/**
 * 
 */
export function createSignatureTuple(claim: string) {
  const [kind, signature] = claim.split(':');

  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`),
    kind,
  };

  if (signatureData.v < 27) {
    signatureData.v = signatureData.v + 27;
  }

  return toTuple(signatureData);
}

/**
 * 
 */
export function getActionKind(action: OrderAction) {
  return action.kind === OrderActionKind.CREATE_ASSET ? 0 : 1;
}

/**
 * 
 */
export function getActionProxy(gateway: OrderGateway, action: OrderAction) {
  if (action.kind === OrderActionKind.TRANSFER_VALUE) {
    return 1;
  }
  else if (action.kind === OrderActionKind.TRANSFER_ASSET) {
    return gateway.provider.unsafeRecipientIds.indexOf(action.receiverId) !== -1 ? 2 : 3;
  }
  else {
    return 0;
  }
}

/**
 * 
 */
export function getActionParam1(action: OrderAction) {
  return action.kind === OrderActionKind.CREATE_ASSET
    ? action['assetProof']
    : padLeft(action.senderId, 64);
}

/**
 * 
 */
export function getActionValue(action: OrderAction) {
  return action['assetId'] || action['value'];
}
