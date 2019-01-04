import { AbiCoder } from 'ethers/utils/abi-coder';

const coder = new AbiCoder();

export function encodeParameters(types: any, values: any) {
  return coder.encode(types, values);
}

export function decodeParameters(types: any, data: any) {
  return coder.decode(types, data);
}
