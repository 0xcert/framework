import * as Web3 from 'web3';
import * as env from '../config/env';

/**
 * Returns Xcert smart contract instance.
 * @param web3 Web3 instance.
 * @param folderId Xcert address.
 */
export function getFolder(web3: Web3, folderId?: string) {
  return new web3.eth.Contract(env.xcertAbi, folderId);
}

/**
 * Returns Minter smart contract instance.
 * @param web3 Web3 instance.
 * @param minterId Minter address.
 */
export function getMinter(web3: Web3, minterId?: string) {
  return new web3.eth.Contract(env.minterAbi, minterId);
}

/**
 * Returns Exchange smart contract instance.
 * @param web3 Web3 instance.
 * @param exchangeId Exchange address.
 */
export function getExchange(web3: Web3, exchangeId?: string) {
  return new web3.eth.Contract(env.exchangeAbi, exchangeId);
}

/**
 * Returns the provided accountId or the coinbase address.
 * @param web3 Web3 instance.
 * @param accointId Ethereum address.
 */
export async function getAccount(web3: Web3, accountId?: string) {
  return accountId ? accountId : await web3.eth.getCoinbase();
}
