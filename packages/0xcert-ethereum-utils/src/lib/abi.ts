import * as eth from 'web3-eth-abi';

// TODO!!!!!!!

export function encodeFunctionCall(abi: any, data: any) {
  return eth.encodeFunctionCall(abi, data);
}

export function encodeParameters(abi: any, data: any) {
  return eth.encodeParameters(abi, data);
}

export function decodeParameters(abi: any, data: any) {
  const output = eth.decodeParameters(abi, data);

  // for (const i in abi) {
  //   switch(abi[i].type) {
  //     case 'uint256':
  //       output[i] = new Big(output[i]);
  //       break;
  //   }
  // }

  return output;
}

export function decodeParameter(type: string, data: any) {
  return eth.decodeParameter(type, data);
}

export function normalizeAddress(address) {
  // alternative: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
  if (!address) return address;
  return address.toLowerCase();
}
