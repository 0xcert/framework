import * as eth from 'web3-eth-abi';

// TODO!!!!!!!

export function encodeFunctionCall(abi: any, data: any) {
  return eth.encodeFunctionCall(abi, data);
}

export function encodeParameters(abi: any, data: any) {
  return eth.encodeParameters(abi, data);
}

export function decodeParameters(abi: any, data: any) {
  return eth.decodeParameters(abi, data);
}
