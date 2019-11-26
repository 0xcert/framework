import { getInterfaceCode } from '@0xcert/ethereum-asset-ledger';
import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import { bigNumberify, hexToBytes, leftPad, rightPad, stringToHex, ZERO_ADDRESS } from '@0xcert/ethereum-utils';
import { AssetLedgerDeployOrder, ProviderError, ProviderIssue } from '@0xcert/scaffold';
import { keccak256, toInteger, toSeconds, toTuple } from '@0xcert/utils';
import { Gateway } from '../core/gateway';

/**
 * Generates order hash from input data.
 * @param gateway Gateway instance.
 * @param order Order instance.
 */
export function createOrderHash(gateway: Gateway, order: AssetLedgerDeployOrder) {

  const capabilities = order.assetLedgerData.capabilities
    .map((c) => rightPad(getInterfaceCode(c), 64, '0', false))
    .join('');

  const xcertData = keccak256(
    hexToBytes([
      '0x',
      stringToHex(order.assetLedgerData.name),
      stringToHex(order.assetLedgerData.symbol),
      stringToHex(order.assetLedgerData.uriPrefix),
      stringToHex(order.assetLedgerData.uriPostfix),
      order.assetLedgerData.schemaId,
      capabilities,
      order.assetLedgerData.ownerId.substr(2),
    ].join('')),
  );

  const transferData = keccak256(
    hexToBytes([
      '0x',
      order.tokenTransferData.ledgerId.substr(2),
      order.tokenTransferData.receiverId.substr(2),
      getValue(order.tokenTransferData.value).substr(2),
    ].join('')),
  );

  return keccak256(
    hexToBytes([
      '0x',
      gateway.config.assetLedgerDeployOrderId.substr(2),
      order.makerId.substr(2),
      order.takerId.substr(2),
      xcertData.substr(2),
      transferData.substr(2),
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
 * Flattens and reshapes order input data into a tuple.
 * @param order Order instance.
 */
export function createRecipeTuple(order: AssetLedgerDeployOrder) {
  const recipeData = {
    maker: order.makerId,
    taker: order.takerId,
    xcertData: {
      name: order.assetLedgerData.name,
      symbol: order.assetLedgerData.symbol,
      uriPrefix: order.assetLedgerData.uriPrefix,
      uriPostfix: order.assetLedgerData.uriPostfix,
      schemaId: `0x${order.assetLedgerData.schemaId}`,
      capabilities: order.assetLedgerData.capabilities.map((c) => { return getInterfaceCode(c); }),
      owner: order.assetLedgerData.ownerId,
    },
    transferData: {
      token: order.tokenTransferData.ledgerId,
      to: order.tokenTransferData.receiverId,
      value: getValue(order.tokenTransferData.value),
    },
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
 * Normalizes order IDs and returns a new order object.
 * @param order Order instance.
 * @param provider Provider instance.
 */
export function normalizeOrderIds(order: AssetLedgerDeployOrder, provider: GenericProvider): AssetLedgerDeployOrder {
  order = JSON.parse(JSON.stringify(order));
  let dynamic = false;

  if (!order.takerId) {
    order.takerId = ZERO_ADDRESS;
    dynamic = true;
  } else {
    order.takerId = provider.encoder.normalizeAddress(order.takerId);
  }
  order.makerId = provider.encoder.normalizeAddress(order.makerId);
  order.tokenTransferData.ledgerId = provider.encoder.normalizeAddress(order.tokenTransferData.ledgerId);

  if (!order.tokenTransferData.receiverId) {
    if (!dynamic) {
      throw new ProviderError(ProviderIssue.NO_RECEIVER_ID);
    }
    order.tokenTransferData.receiverId = ZERO_ADDRESS;
  } else {
    order.tokenTransferData.receiverId = provider.encoder.normalizeAddress(order.tokenTransferData.receiverId);
  }
  order.assetLedgerData.ownerId = provider.encoder.normalizeAddress(order.assetLedgerData.ownerId);
  return order;
}
