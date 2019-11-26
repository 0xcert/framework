import { getBitfieldFromAbilities } from '@0xcert/ethereum-asset-ledger';
import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import { bigNumberify, hexToBytes, leftPad, rightPad, ZERO_ADDRESS } from '@0xcert/ethereum-utils';
import { ActionsOrder, ActionsOrderAction, ActionsOrderActionKind, OrderKind, ProviderError, ProviderIssue } from '@0xcert/scaffold';
import { keccak256, toInteger, toSeconds, toTuple } from '@0xcert/utils';
import { Gateway } from '../core/gateway';
import { ProxyId } from '../core/types';

/**
 * Generates order hash from input data.
 * @param gateway Gateway instance.
 * @param order ActionsOrder instance.
 */
export function createOrderHash(gateway: Gateway, order: ActionsOrder) {
  let actionsHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
  for (const action of order.actions) {
    actionsHash = keccak256(
      hexToBytes([
        '0x',
        actionsHash.substr(2),
        `0000000${getActionProxy(gateway, action)}`,
        action.ledgerId.substr(2),
        getActionParams(action, order.signers).substr(2),
      ].join('')),
    );
  }

  return keccak256(
    hexToBytes([
      '0x',
      gateway.config.actionsOrderId.substr(2),
      parseAddresses(order.signers),
      actionsHash.substr(2),
      leftPad(toInteger(order.seed), 64, '0', false),
      leftPad(toSeconds(order.expiration), 64, '0', false),
    ].join('')),
  );
}

/**
 * Encodes an array of addresses.
 * @param addresses Array of addresses.
 */
export function parseAddresses(addresses: string[]) {
  let encoded = '';
  addresses.forEach((signer) => {
    encoded += leftPad(signer.substr(2), 64, '0', false);
  });
  return encoded;
}

/**
 * Encodes action parameters dependion on the action.
 * @param action ActionsOrderAction instance.
 * @param signers Array of signers.
 */
export function getActionParams(action: ActionsOrderAction, signers: string[]) {
  let params = '';
  const signerIndex = signers.indexOf(action['senderId']);
  if (signerIndex === -1) {
    throw new ProviderError(ProviderIssue.SENDER_ID_NOT_A_SIGNER);
  }
  if (action.kind == ActionsOrderActionKind.CREATE_ASSET) {
    params = rightPad(`0x${action['assetImprint']}`, 64);
    params += leftPad(bigNumberify(action['assetId']).toHexString(), 64, '0', false);
    params += action['receiverId'].substr(2);
    params += leftPad(bigNumberify(signerIndex).toHexString(), 2, '0', false);
  } else if (action.kind == ActionsOrderActionKind.SET_ABILITIES) {
    const bitAbilities = getBitfieldFromAbilities(action.abilities);
    params =  leftPad(bitAbilities, 64, '0', true);
    params += action['receiverId'].substr(2);
    params += leftPad(bigNumberify(signerIndex).toHexString(), 2, '0', false);
  } else if (action.kind == ActionsOrderActionKind.TRANSFER_ASSET) {
    params = leftPad(bigNumberify(action['assetId']).toHexString(), 64, '0', true);
    params += action['receiverId'].substr(2);
    params += leftPad(bigNumberify(signerIndex).toHexString(), 2, '0', false);
  } else if (action.kind == ActionsOrderActionKind.TRANSFER_VALUE) {
    params = leftPad(bigNumberify(action['value']).toHexString(), 64, '0', true);
    params += action['receiverId'].substr(2);
    params += leftPad(bigNumberify(signerIndex).toHexString(), 2, '0', false);
  } else if (action.kind == ActionsOrderActionKind.UPDATE_ASSET_IMPRINT) {
    params = rightPad(`0x${action['assetImprint']}`, 64);
    params += leftPad(bigNumberify(action['assetId']).toHexString(), 64, '0', false);
    params += leftPad(bigNumberify(signerIndex).toHexString(), 2, '0', false);
  } else if (action.kind == ActionsOrderActionKind.DESTROY_ASSET) {
    params = leftPad(bigNumberify(action['assetId']).toHexString(), 64, '0', true);
    params += leftPad(bigNumberify(signerIndex).toHexString(), 2, '0', false);
  }
  return params;
}

/**
 * Flattens and reshapes order input data into a tuple.
 * @param gateway Gateway instance.
 * @param order ActionsOrder instance.
 */
export function createRecipeTuple(gateway: Gateway, order: ActionsOrder) {
  const actions = (order.actions as ActionsOrderAction[]).map((action) => {
    return {
      proxyId: getActionProxy(gateway, action),
      contractAddress: action.ledgerId,
      params: getActionParams(action, order.signers),
    };
  });

  const recipeData = {
    signers: order.signers,
    actions,
    seed: toInteger(order.seed),
    expirationTimestamp: toSeconds(order.expiration),
  };
  return toTuple(recipeData);
}

/**
 * Flattens and reshapes signature input data into a tuple.
 * @param claim String or array of strings representing a signed claim.
 */
export function createSignatureTuple(claim: string[] | string) {
  if (typeof claim === 'string') {
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
  } else {
    const signatures = [];
    claim.forEach((c) => {
      const [kind, signature] = c.split(':');
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
      signatures.push(signatureData);
    });
    return toTuple(signatures);
  }
}

/**
 * Gets the correct proxy for the specified action.
 * @param gateway Gateway instance.
 * @param action ActionsOrderAction instance.
 */
export function getActionProxy(gateway: Gateway, action: ActionsOrderAction) {
  if (action.kind == ActionsOrderActionKind.TRANSFER_VALUE) {
    return ProxyId.TOKEN_TRANSFER;
  } else if (action.kind == ActionsOrderActionKind.TRANSFER_ASSET) {
    return gateway.provider.unsafeRecipientIds.indexOf(action.ledgerId) === -1
      ? ProxyId.NFTOKEN_SAFE_TRANSFER
      : ProxyId.NFTOKEN_TRANSFER;
  } else if (action.kind == ActionsOrderActionKind.CREATE_ASSET) {
    return ProxyId.XCERT_CREATE;
  } else if (action.kind == ActionsOrderActionKind.SET_ABILITIES) {
    return ProxyId.MANAGE_ABILITIES;
  } else if (action.kind == ActionsOrderActionKind.UPDATE_ASSET_IMPRINT) {
    return ProxyId.XCERT_UPDATE;
  } else if (action.kind == ActionsOrderActionKind.DESTROY_ASSET) {
    return ProxyId.XCERT_BURN;
  } else {
    throw new ProviderError(ProviderIssue.ACTION_KIND_NOT_SUPPORTED);
  }
}

/**
 * Normalizes order IDs and returns a new order object.
 * @param order Order instance.
 * @param provider Provider instance.
 */
export function normalizeOrderIds(order: ActionsOrder, provider: GenericProvider): ActionsOrder {
  order = JSON.parse(JSON.stringify(order));

  for (let i = 0; i < order.signers.length; i++) {
    order.signers[i] = provider.encoder.normalizeAddress(order.signers[i]);
  }

  if (order.kind === OrderKind.FIXED_ACTIONS_ORDER || order.kind == OrderKind.SIGNED_FIXED_ACTIONS_ORDER) {
    order.actions.forEach((action) => {
      action.ledgerId = provider.encoder.normalizeAddress(action.ledgerId);
      if (action.kind !== ActionsOrderActionKind.UPDATE_ASSET_IMPRINT && action.kind !== ActionsOrderActionKind.DESTROY_ASSET) {
        action['receiverId'] = provider.encoder.normalizeAddress(action['receiverId']);
      }
      action['senderId'] = provider.encoder.normalizeAddress(action['senderId']);
    });
  } else {
    order.actions.forEach((action) => {
      action.ledgerId = provider.encoder.normalizeAddress(action.ledgerId);
      action['senderId'] = action['senderId'] ? provider.encoder.normalizeAddress(action['senderId']) : action['senderId'] = ZERO_ADDRESS;
      if (action.kind !== ActionsOrderActionKind.UPDATE_ASSET_IMPRINT && action.kind !== ActionsOrderActionKind.DESTROY_ASSET) {
        action['receiverId'] = action['receiverId'] ? provider.encoder.normalizeAddress(action['receiverId']) : action['receiverId'] = ZERO_ADDRESS;
        if (action['senderId'] === ZERO_ADDRESS && action['receiverId'] === ZERO_ADDRESS) {
          throw new ProviderError(ProviderIssue.SENDER_ID_AND_RECEIVER_ID_MISSING);
        }
      }
    });
  }
  return order;
}
