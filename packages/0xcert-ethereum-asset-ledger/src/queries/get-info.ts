import { encodeFunctionCall, decodeParameters } from 'web3-eth-abi';
import { AssetLedger } from '../core/ledger';
import xcertAbi from '../config/xcertAbi';

/**
 * 
 */
async function getName(ledger: AssetLedger) {

  const abi = xcertAbi.find((a) => (
    a.name === 'name' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_call',
    params: [
      {
        to: ledger.id,
        data: encodeFunctionCall(abi, []),
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
async function getSymbol(ledger: AssetLedger) {

  const abi = xcertAbi.find((a) => (
    a.name === 'symbol' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_call',
    params: [
      {
        to: ledger.id,
        data: encodeFunctionCall(abi, []),
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
async function getUriBase(ledger: AssetLedger) {

  const abi = xcertAbi.find((a) => (
    a.name === 'uriBase' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_call',
    params: [
      {
        to: ledger.id,
        data: encodeFunctionCall(abi, []),
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
async function getConventionId(ledger: AssetLedger) {

  const abi = xcertAbi.find((a) => (
    a.name === 'conventionId' && a.type === 'function'
  ));

  return ledger.provider.send({
    method: 'eth_call',
    params: [
      {
        to: ledger.id,
        data: encodeFunctionCall(abi, []),
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
export default async function(ledger: AssetLedger) {
  return {
    name: await getName(ledger),
    symbol: await getSymbol(ledger),
    uriBase: await getUriBase(ledger),
    conventionId: await getConventionId(ledger),
  };
}
