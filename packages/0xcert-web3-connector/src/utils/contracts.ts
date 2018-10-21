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
 * Returns the provided accountId or the coinbase address.
 * @param web3 Web3 instance.
 * @param accointId Ethereum address.
 */
export async function getAccount(web3: Web3, accountId?: string) {
  return accountId ? accountId : await web3.eth.getCoinbase();
}
