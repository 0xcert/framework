import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import { bigNumberify } from '@0xcert/ethereum-utils';
import { ActionsOrder, ActionsOrderAction, ActionsOrderActionKind, ProviderError, ProviderIssue } from '@0xcert/scaffold';
import { keccak256, toInteger, toSeconds, toTuple } from '@0xcert/utils';
import { Gateway } from '../core/gateway';
import { OrderGatewayProxy } from '../core/types';
import { hexToBytes, leftPad, rightPad, zeroAddress } from './utils';

/**
 * Generates order hash from input data.
 * @param gateway Gateway instance.
 * @param order ActionsOrder instance.
 */
export function createOrderHash(gateway: Gateway, order: ActionsOrder) {
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
        getActionTo(action).substr(2),
        getActionValue(action).substr(2),
      ].join('')),
    );
  }

  return keccak256(
    hexToBytes([
      '0x',
      gateway.config.actionsOrderId.substr(2),
      order.makerId.substr(2),
      order.takerId.substr(2),
      temp.substr(2),
      leftPad(toInteger(order.seed), 64, '0', false),
      leftPad(toSeconds(order.expiration), 64, '0', false),
    ].join('')),
  );
}

/**
 * Flattens and reshapes order input data into a tuple.
 * @param gateway Gateway instance.
 * @param order ActionsOrder instance.
 */
export function createRecipeTuple(gateway: Gateway, order: ActionsOrder) {

  const actions = order.actions.map((action) => {
    return {
      kind: getActionKind(action),
      proxy: getActionProxy(gateway, action),
      token: action.ledgerId,
      param1: getActionParam1(action),
      to: getActionTo(action),
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
 * Flattens and reshapes signature input data into a tuple.
 * @param claim String representing a signed claim.
 */
export function createSignatureTuple(claim: string) {
  const [kind, signature] = claim.split(':');
  const k = (parseInt(kind) == SignMethod.PERSONAL_SIGN) ? SignMethod.ETH_SIGN : kind;

  const signatureData = {
    r: signature.substr(0, 66),
    s: `0x${signature.substr(66, 64)}`,
    v: parseInt(`0x${signature.substr(130, 2)}`),
    k,
  };

  if (signatureData.v < 27) {
    signatureData.v = signatureData.v + 27;
  }

  return toTuple(signatureData);
}

/**
 * Generates smart contract data for action kind.
 * @param action ActionsOrderAction instance.
 */
export function getActionKind(action: ActionsOrderAction) {
  switch (action.kind) {
    case ActionsOrderActionKind.CREATE_ASSET: {
      return '00';
    }
    case ActionsOrderActionKind.UPDATE_ASSET_IMPRINT: {
      return '02';
    }
    case ActionsOrderActionKind.SET_ABILITIES: {
      return '03';
    }
    default: {
      return '01';
    }
  }
}

/**
 * Gets the correct to address.
 * @param action ActionsOrderAction instance.
 */
export function getActionTo(action: ActionsOrderAction) {
  if (action.kind == ActionsOrderActionKind.UPDATE_ASSET_IMPRINT) {
    return '0x0000000000000000000000000000000000000000';
  } else {
    return action.receiverId;
  }
}

/**
 * Gets the correct proxy for the specified action.
 * @param gateway Gateway instance.
 * @param action ActionsOrderAction instance.
 */
export function getActionProxy(gateway: Gateway, action: ActionsOrderAction) {
  if (action.kind == ActionsOrderActionKind.TRANSFER_VALUE) {
    return OrderGatewayProxy.TOKEN_TRANSFER;
  } else if (action.kind == ActionsOrderActionKind.TRANSFER_ASSET) {
    return gateway.provider.unsafeRecipientIds.indexOf(action.ledgerId) === -1
      ? OrderGatewayProxy.NFTOKEN_SAFE_TRANSFER
      : OrderGatewayProxy.NFTOKEN_TRANSFER;
  } else if (action.kind == ActionsOrderActionKind.CREATE_ASSET) {
    return OrderGatewayProxy.XCERT_CREATE;
  } else if (action.kind == ActionsOrderActionKind.SET_ABILITIES) {
    return OrderGatewayProxy.MANAGE_ABILITIES;
  } else {
    return OrderGatewayProxy.XCERT_UPDATE;
  }
}

/**
 * Generates smart contract data for param 1.
 * @param action ActionsOrderAction instance.
 */
export function getActionParam1(action: ActionsOrderAction) {
  if (action.kind == ActionsOrderActionKind.CREATE_ASSET
    || action.kind == ActionsOrderActionKind.UPDATE_ASSET_IMPRINT) {
    return rightPad(`0x${action['assetImprint']}`, 64);
  } else if (action.kind == ActionsOrderActionKind.SET_ABILITIES) {
    return '0x0000000000000000000000000000000000000000000000000000000000000000';
  } else {
    return `${action['senderId']}000000000000000000000000`;
  }
}

/**
 * Generates smart contract data for value.
 * @param action ActionsOrderAction instance.
 */
export function getActionValue(action: ActionsOrderAction) {
  if (action.kind === ActionsOrderActionKind.SET_ABILITIES) {
    let bitAbilities = bigNumberify(0);
    action.abilities.forEach((ability) => {
      bitAbilities = bitAbilities.add(ability);
    });
    return leftPad(bigNumberify(bitAbilities).toHexString(), 64, '0', true);
  } else {
    return leftPad(bigNumberify(action['assetId'] || action['value']).toHexString(), 64, '0', true);
  }
}

/**
 * Normalizes order IDs and returns a new order object.
 * @param order Order instance.
 */
export function normalizeOrderIds(order: ActionsOrder, provider: GenericProvider): ActionsOrder {
  order = JSON.parse(JSON.stringify(order));
  let dynamic = false;

  if (!order.takerId) {
    order.takerId = zeroAddress;
    dynamic = true;
  } else {
    order.takerId = provider.encoder.normalizeAddress(order.takerId);
  }

  order.makerId = provider.encoder.normalizeAddress(order.makerId);
  order.actions.forEach((action) => {
    action.ledgerId = provider.encoder.normalizeAddress(action.ledgerId);
    if (action.kind === ActionsOrderActionKind.UPDATE_ASSET_IMPRINT) {
      action['receiverId'] = zeroAddress;
    }
    if (!action['receiverId']) {
      if (!dynamic) {
        throw new ProviderError(ProviderIssue.WRONG_INPUT, 'receiverId is not set.');
      }
      action['receiverId'] = zeroAddress;
    } else {
      action['receiverId'] = provider.encoder.normalizeAddress(action['receiverId']);
    }
    if (action.kind !== ActionsOrderActionKind.CREATE_ASSET
      && action.kind !== ActionsOrderActionKind.UPDATE_ASSET_IMPRINT
      && action.kind !== ActionsOrderActionKind.SET_ABILITIES) {
      if (!action['senderId']) {
        if (!dynamic) {
          throw new ProviderError(ProviderIssue.WRONG_INPUT, 'senderId is not set.');
        } else if (dynamic && action['receiverId'] === zeroAddress) {
          throw new ProviderError(ProviderIssue.WRONG_INPUT, 'Either senderId or receiverId need to be set.');
        }
        action['senderId'] = zeroAddress;
      } else {
        action['senderId'] = provider.encoder.normalizeAddress(action['senderId']);
      }
    }
  });
  return order;
}
