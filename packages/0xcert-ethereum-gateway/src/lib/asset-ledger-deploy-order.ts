import { getInterfaceCode } from '@0xcert/ethereum-asset-ledger';
import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import { bigNumberify } from '@0xcert/ethereum-utils';
import { AssetLedgerDeployOrder, ProviderError, ProviderIssue } from '@0xcert/scaffold';
import { keccak256, toInteger, toSeconds, toTuple } from '@0xcert/utils';
import { Gateway } from '../core/gateway';

export const zeroAddress = '0x0000000000000000000000000000000000000000';

/**
 * Generates order hash from input data.
 * @param gateway Gateway instance.
 * @param order Order instance.
 */
export function createOrderHash(gateway: Gateway, order: AssetLedgerDeployOrder) {

  let capabilities = '';
  order.assetLedgerData.capabilities.forEach((c) => {
    capabilities = capabilities + rightPad(getInterfaceCode(c), 64, '0', false);
  });

  const xcertData = keccak256(
    hexToBytes([
      '0x',
      stringToHex(order.assetLedgerData.name),
      stringToHex(order.assetLedgerData.symbol),
      stringToHex(order.assetLedgerData.uriBase),
      order.assetLedgerData.schemaId.substr(2),
      capabilities,
      order.assetLedgerData.owner.substr(2),
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
      gateway.id.substr(2),
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
 * Changes string to hex representation.
 * @param str String to change into hex.
 */
function stringToHex(str: String) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
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
      uriBase: order.assetLedgerData.uriBase,
      schemaId: order.assetLedgerData.schemaId,
      capabilities: order.assetLedgerData.capabilities.map((c) => { return getInterfaceCode(c); }),
      owner: order.assetLedgerData.owner,
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
export function rightPad(input: any, chars: number, sign?: string, prefix?: boolean) {
  const hasPrefix = prefix === undefined ? /^0x/i.test(input) || typeof input === 'number' : prefix;
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

/**
 * Normalizes order IDs and returns a new order object.
 * @param order Order instance.
 */
export function normalizeOrderIds(order: AssetLedgerDeployOrder, provider: GenericProvider): AssetLedgerDeployOrder {
  order = JSON.parse(JSON.stringify(order));
  let dynamic = false;

  if (!order.takerId) {
    order.takerId = zeroAddress;
    dynamic = true;
  } else {
    order.takerId = provider.encoder.normalizeAddress(order.takerId);
  }
  order.makerId = provider.encoder.normalizeAddress(order.makerId);
  order.tokenTransferData.ledgerId = provider.encoder.normalizeAddress(order.tokenTransferData.ledgerId);

  if (!order.tokenTransferData.receiverId) {
    if (!dynamic) {
      throw new ProviderError(ProviderIssue.WRONG_INPUT, 'receiverId is not set.');
    }
    order.tokenTransferData.receiverId = zeroAddress;
  } else {
    order.tokenTransferData.receiverId = provider.encoder.normalizeAddress(order.tokenTransferData.receiverId);
  }
  order.assetLedgerData.owner = provider.encoder.normalizeAddress(order.assetLedgerData.owner);
  return order;
}
