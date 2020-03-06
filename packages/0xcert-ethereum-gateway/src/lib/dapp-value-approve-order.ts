import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import { bigNumberify, hexToBytes, leftPad, ZERO_ADDRESS } from '@0xcert/ethereum-utils';
import { DappValueApproveOrder } from '@0xcert/scaffold';
import { keccak256, toInteger, toSeconds, toTuple } from '@0xcert/utils';

/**
 * Generates order hash from input data.
 * @param gateway Gateway instance.
 * @param order Order instance.
 */
export function createOrderHash(order: DappValueApproveOrder) {
  return keccak256(
    hexToBytes([
      '0x',
      order.ledgerId.substr(2),
      order.approver.substr(2),
      order.spender.substr(2),
      getValue(order.value).substr(2),
      order.feeRecipient.substr(2),
      getValue(order.feeValue).substr(2),
      leftPad(toInteger(order.seed), 64, '0', false),
      leftPad(toSeconds(order.expiration), 64, '0', false),
    ].join('')),
  );
}

/**
 * Generates smart contract data for value.
 * @param value String value.
 */
export function getValue(value: string) {
  return leftPad(bigNumberify(value).toHexString(), 64, '0', true);
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
 * Gets order params in correct form.
 * @param order Order instance.
 */
export function getOrderInputParams(order: DappValueApproveOrder): any[] {
  return [
    order.approver,
    order.spender,
    getValue(order.value),
    order.feeRecipient,
    getValue(order.feeValue),
    toInteger(order.seed),
    toSeconds(order.expiration),
  ];
}

/**
 * Normalizes order IDs and returns a new order object.
 * @param order Order instance.
 * @param provider Provider instance.
 */
export function normalizeOrderIds(order: DappValueApproveOrder, provider: GenericProvider): DappValueApproveOrder {
  order = JSON.parse(JSON.stringify(order));

  order.ledgerId = provider.encoder.normalizeAddress(order.ledgerId);
  order.approver = provider.encoder.normalizeAddress(order.approver);
  order.spender = provider.encoder.normalizeAddress(order.spender);
  order.feeRecipient = order.feeRecipient ? provider.encoder.normalizeAddress(order.feeRecipient) : ZERO_ADDRESS;

  return order;
}
