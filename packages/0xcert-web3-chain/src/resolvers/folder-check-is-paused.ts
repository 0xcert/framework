import { IFolderCheckIsPausedChainRequest as IChainRequest,
  IFolderCheckIsPausedChainResponse as IChainResponse } from '@0xcert/chain';
import { Chain } from '../core/chain';
import * as env from '../config/env';

/**
 * Chain request resolver for ChainAction.FOLDER_CHECK_IS_PAUSED.
 * @param con Connector class instance.
 * @param req Protocol request object.
 */
export default async function(chain: Chain, req: IChainRequest): Promise<IChainResponse> {

  const instance = new chain.web3.eth.Contract(env.xcertAbi, req.folderId);

  return {
    isPaused: await instance.methods.isPaused().call().catch((e) => false),
  };
}
