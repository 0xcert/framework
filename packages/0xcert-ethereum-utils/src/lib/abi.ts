import { AbiCoder } from 'ethers/utils/abi-coder';

const coder = new AbiCoder();

/**
 * Encodes parameters for smart contract call.
 * @param types Input types.
 * @param values Input values.
 */
export function encodeParameters(types: any, values: Array<any>): string {
  return coder.encode(types, values);
}

/**
 * Decodes parameters from smart contract return.
 * @param types Output types.
 * @param data Output data.
 */
export function decodeParameters(types: any, data: any): any {
  return coder.decode(types, data);
}
