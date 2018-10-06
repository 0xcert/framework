import { IFolderReadCapabilitiesChainRequest as IChainRequest,
  IFolderReadCapabilitiesChainResponse as IChainResponse } from '@0xcert/chain';
import { Chain } from '../core/chain';
import * as env from '../config/env';

/**
 * Chain request resolver for ChainAction.FOLDER_READ_CAPABILITIES.
 * @param con Connector class instance.
 * @param req Protocol request object.
 */
export default async function(chain: Chain, req: IChainRequest): Promise<IChainResponse> {

  const instance = new chain.web3.eth.Contract(env.xcertAbi, req.folderId);

  return {
    isBurnable: await instance.methods.supportsInterface('0x42966c68').call(),
    isMutable: await instance.methods.supportsInterface('0x33b641ae').call(),
    isPausable: await instance.methods.supportsInterface('0xbedb86fb').call(),
    isRevokable: await instance.methods.supportsInterface('0x20c5429b').call(),
  };
}
