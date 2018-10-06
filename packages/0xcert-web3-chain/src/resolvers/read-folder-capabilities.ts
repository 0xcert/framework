import { IReadFolderCapabilitiesRequest as IRequest } from '@0xcert/chain';
import { IReadFolderCapabilitiesResponse as IResponse } from '@0xcert/chain';
import { Connector } from '../core/connector';
import * as env from '../config/env';

/**
 * Protocol request resolver for ActionId.READ_FOLDER_CAPABILITIES.
 * @param con Connector class instance.
 * @param req Protocol request object.
 */
export default async function(con: Connector, req: IRequest): Promise<IResponse> {

  const instance = new con.web3.eth.Contract(env.xcertAbi, req.folderId);

  return {
    isBurnable: await instance.methods.supportsInterface('0x42966c68').call(),
    isMutable: await instance.methods.supportsInterface('0x33b641ae').call(),
    isPausable: await instance.methods.supportsInterface('0xbedb86fb').call(),
    isRevokable: await instance.methods.supportsInterface('0x20c5429b').call(),
  };
}
