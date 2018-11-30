import { encodeFunctionCall, decodeParameters } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
async function getUri(ledger: AssetLedger, assetId: string) {

  const abi = xcertAbi.find((a) => (
    a.name === 'tokenURI' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_call',
    params: [
      {
        to: ledger.id,
        data: encodeFunctionCall(abi, [assetId]),
      },
      'latest'
    ],
  }).then(({ result }) => {
    return decodeParameters(abi.outputs, result);
  }).then((r) => {
    return r[0];
  });
}

/**
 * 
 */
async function getProof(ledger: AssetLedger, assetId: string) {

  const abi = xcertAbi.find((a) => (
    a.name === 'tokenProof' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_call',
    params: [
      {
        to: ledger.id,
        data: encodeFunctionCall(abi, [assetId]),
      },
      'latest'
    ],
  }).then(({ result }) => {
    return decodeParameters(abi.outputs, result);
  }).then((r) => {
    return r[0];
  });
}

/**
 * 
 */
export default async function(ledger: AssetLedger, assetId: string) {
  return {
    id: assetId,
    uri: await getUri(ledger, assetId),
    proof: await getProof(ledger, assetId),
  };
}
