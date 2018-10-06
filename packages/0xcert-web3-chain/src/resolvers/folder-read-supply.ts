import { IFolderReadSupplyChainRequest as IChainRequest,
  IFolderReadSupplyChainResponse as IChainResponse } from '@0xcert/chain';
import { Chain } from '../core/chain';
import * as env from '../config/env';

/**
 * Chain request resolver for ChainAction.FOLDER_READ_SUPPLY.
 * @param con Connector class instance.
 * @param req Protocol request object.
 */
export default async function(chain: Chain, req: IChainRequest): Promise<IChainResponse> {

  const instance = new chain.web3.eth.Contract(env.xcertAbi, req.folderId);

  return {
    totalCount: await instance.methods.totalSupply().call().then((s) => parseInt(s)),
  };
}
