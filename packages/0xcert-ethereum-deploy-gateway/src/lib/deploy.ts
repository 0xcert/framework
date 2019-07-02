import { getInterfaceCode } from '@0xcert/ethereum-asset-ledger';
import { GenericProvider, SignMethod } from '@0xcert/ethereum-generic-provider';
import { bigNumberify } from '@0xcert/ethereum-utils';
import { Deploy, ProviderError, ProviderIssue } from '@0xcert/scaffold';
import { keccak256, toInteger, toSeconds, toTuple } from '@0xcert/utils';
import { DeployGateway } from '../core/gateway';

export const zeroAddress = '0x0000000000000000000000000000000000000000';

/**
 * Generates deploy hash from input data.
 * @param gateway DeployGateway instance.
 * @param deploy Deploy instance.
 */
export function createDeployHash(gateway: DeployGateway, deploy: Deploy) {

  let capabilities = '';
  deploy.assetLedgerData.capabilities.forEach((c) => {
    capabilities = capabilities + rightPad(getInterfaceCode(c), 64, '0', false);
  });

  const xcertData = keccak256(
    hexToBytes([
      '0x',
      stringToHex(deploy.assetLedgerData.name),
      stringToHex(deploy.assetLedgerData.symbol),
      stringToHex(deploy.assetLedgerData.uriBase),
      deploy.assetLedgerData.schemaId.substr(2),
      capabilities,
      deploy.assetLedgerData.owner.substr(2),
    ].join('')),
  );

  const transferData = keccak256(
    hexToBytes([
      '0x',
      deploy.tokenTransferData.ledgerId.substr(2),
      deploy.tokenTransferData.receiverId.substr(2),
      getValue(deploy.tokenTransferData.value).substr(2),
    ].join('')),
  );

  return keccak256(
    hexToBytes([
      '0x',
      gateway.id.substr(2),
      deploy.makerId.substr(2),
      deploy.takerId.substr(2),
      xcertData.substr(2),
      transferData.substr(2),
      leftPad(toInteger(deploy.seed), 64, '0', false),
      leftPad(toSeconds(deploy.expiration), 64, '0', false),
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
 * Flattens and reshapes deploy input data into a tuple.
 * @param deploy Deploy instance.
 */
export function createRecipeTuple(deploy: Deploy) {
  const recipeData = {
    maker: deploy.makerId,
    taker: deploy.takerId,
    xcertData: {
      name: deploy.assetLedgerData.name,
      symbol: deploy.assetLedgerData.symbol,
      uriBase: deploy.assetLedgerData.uriBase,
      schemaId: deploy.assetLedgerData.schemaId,
      capabilities: deploy.assetLedgerData.capabilities.map((c) => { return getInterfaceCode(c); }),
      owner: deploy.assetLedgerData.owner,
    },
    transferData: {
      token: deploy.tokenTransferData.ledgerId,
      to: deploy.tokenTransferData.receiverId,
      value: getValue(deploy.tokenTransferData.value),
    },
    seed: toInteger(deploy.seed),
    expirationTimestamp: toSeconds(deploy.expiration),
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
 * Normalizes deploy IDs and returns a new deploy object.
 * @param deploy Deploy instance.
 */
export function normalizeDeployIds(deploy: Deploy, provider: GenericProvider): Deploy {
  deploy = JSON.parse(JSON.stringify(deploy));
  let dynamic = false;

  if (!deploy.takerId) {
    deploy.takerId = zeroAddress;
    dynamic = true;
  } else {
    deploy.takerId = provider.encoder.normalizeAddress(deploy.takerId);
  }
  deploy.makerId = provider.encoder.normalizeAddress(deploy.makerId);
  deploy.tokenTransferData.ledgerId = provider.encoder.normalizeAddress(deploy.tokenTransferData.ledgerId);

  if (!deploy.tokenTransferData.receiverId) {
    if (!dynamic) {
      throw new ProviderError(ProviderIssue.WRONG_INPUT, 'receiverId is not set.');
    }
    deploy.tokenTransferData.receiverId = zeroAddress;
  } else {
    deploy.tokenTransferData.receiverId = provider.encoder.normalizeAddress(deploy.tokenTransferData.receiverId);
  }
  deploy.assetLedgerData.owner = provider.encoder.normalizeAddress(deploy.assetLedgerData.owner);
  return deploy;
}
