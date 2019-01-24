import { bigNumberify } from '@0xcert/ethereum-utils';
import { Order, OrderAction, OrderActionKind } from '@0xcert/scaffold';
import { keccak256, toInteger, toSeconds, toTuple } from '@0xcert/utils';
import { OrderGateway } from '../core/gateway';
import { OrderGatewayProxy } from '../core/types';

/**
 *
 */
export function createOrderHash(gateway: OrderGateway, order: Order) {

  let temp = '0x0000000000000000000000000000000000000000000000000000000000000000';

  for (const action of order.actions) {
    temp = keccak256(
      hexToBytes([
        '0x',
        temp.substr(2),
        getActionKind(action),
        `0000000${getActionProxy(gateway, action)}`,
        action.ledgerId.substr(2),
        getActionParam1(action).substr(2),
        action.receiverId.substr(2),
        getActionValue(action).substr(2),
      ].join('')),
    );
  }

  return keccak256(
    hexToBytes([
      '0x',
      gateway.id.substr(2),
      order.makerId.substr(2),
      order.takerId.substr(2),
      temp.substr(2),
      leftPad(toInteger(order.seed), 64, '0', false),
      leftPad(toSeconds(order.expiration), 64, '0', false),
    ].join('')),
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
  return action.kind == OrderActionKind.CREATE_ASSET ? '00' : '01';
}

/**
 *
 */
export function getActionProxy(gateway: OrderGateway, action: OrderAction) {
  if (action.kind == OrderActionKind.TRANSFER_VALUE) {
    return OrderGatewayProxy.TOKEN_TRANSFER;
  } else if (action.kind == OrderActionKind.TRANSFER_ASSET) {
    return gateway.provider.unsafeRecipientIds.indexOf(action.ledgerId) === -1
      ? OrderGatewayProxy.NFTOKEN_SAFE_TRANSFER
      : OrderGatewayProxy.NFTOKEN_TRANSFER;
  } else {
    return OrderGatewayProxy.XCERT_CREATE;
  }
}

/**
 *
 */
export function getActionParam1(action: OrderAction) {
  return action.kind == OrderActionKind.CREATE_ASSET
    ? rightPad(`0x${action['assetImprint']}`, 64)
    : `${action.senderId}000000000000000000000000`;
}

/**
 *
 */
export function getActionValue(action: OrderAction) {
  return leftPad(bigNumberify(action['assetId'] || action['value']).toHexString(), 64, '0', true);
}

/**
 * @note Based on: https://github.com/ethereum/web3.js/blob/1.0/packages/web3-utils/src/utils.js
 */
export function hexToBytes(hex: any) {
  hex = hex.toString(16).replace(/^0x/i, '');
  const bytes = [];

  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }

  return bytes;
}

/**
 * Should be called to pad string to expected length
 * @note Based on: https://github.com/ethereum/web3.js/blob/1.0/packages/web3-utils/src/utils.js
 * @param string String to be padded.
 * @param chars Chars that result string should have.
 * @param sign Sign by default 0.
 */
export function rightPad(input: any, chars: number, sign?: string) {
  const hasPrefix = /^0x/i.test(input) || typeof input === 'number';
  input = input.toString(16).replace(/^0x/i, '');

  const padding = (chars - input.length + 1 >= 0) ? chars - input.length + 1 : 0;

  return (hasPrefix ? '0x' : '') + input + (new Array(padding).join(sign ? sign : '0'));
}

/**
 * Should be called to pad string to expected length
 * @note Based on: https://github.com/ethereum/web3.js/blob/1.0/packages/web3-utils/src/utils.js
 * @param string String to be padded.
 * @param chars Chars that result string should have.
 * @param sign Sign by default 0.
 * @param prefix Prefix by default calculated depending on input.
 */
export function leftPad(input: any, chars: number, sign?: string, prefix?: boolean) {
  const hasPrefix = prefix === undefined ? /^0x/i.test(input) || typeof input === 'number' : prefix;
  input = input.toString(16).replace(/^0x/i, '');
  const padding = (chars - input.length + 1 >= 0) ? chars - input.length + 1 : 0;

  return (hasPrefix ? '0x' : '') + new Array(padding).join(sign ? sign : '0') + input;
}
