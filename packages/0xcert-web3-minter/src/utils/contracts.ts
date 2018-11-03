import * as env from '../config/env';

/**
 * Returns Xcert smart contract instance.
 * @param web3 Web3 instance.
 * @param folderId Xcert address.
 */
export function getMinter(web3, minterId: string) {
  return new web3.eth.Contract(env.minterAbi, minterId, { gas: 6000000 });
}

/**
 * Returns the provided accountId or the coinbase address.
 * @param web3 Web3 instance.
 * @param accointId Ethereum address.
 */
export async function getAccount(web3, accountId?: string) {
  return accountId ? accountId : await web3.eth.getCoinbase();
}
