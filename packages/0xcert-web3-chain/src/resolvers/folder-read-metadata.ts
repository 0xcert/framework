import { IFolderReadMetadataChainRequest as IChainRequest,
  IFolderReadMetadataChainResponse as IChainResponse } from '@0xcert/chain';
import { Chain } from '../core/chain';
import * as env from '../config/env';

/**
 * Chain request resolver for ChainAction.FOLDER_READ_METADATA.
 * @param con Connector class instance.
 * @param req Protocol request object.
 */
export default async function(chain: Chain, req: IChainRequest): Promise<IChainResponse> {

  const instance = new chain.web3.eth.Contract(env.xcertAbi, req.folderId);

  return {
    name: await instance.methods.name().call(),
    symbol: await instance.methods.symbol().call(),
  };
}
