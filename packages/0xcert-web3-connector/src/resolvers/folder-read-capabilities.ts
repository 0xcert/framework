import { IFolderReadCapabilitiesConnectorRequest as IConnectorRequest,
  IFolderReadCapabilitiesConnectorResponse as IConnectorResponse } from '@0xcert/connector';
import { Connector } from '../core/connector';
import * as env from '../config/env';

/**
 * Connector request resolver for ConnectorAction.FOLDER_READ_CAPABILITIES.
 * @param con Connector class instance.
 * @param req Protocol request object.
 */
export default async function(connector: Connector, req: IConnectorRequest): Promise<IConnectorResponse> {

  const instance = new connector.web3.eth.Contract(env.xcertAbi, req.folderId);

  return {
    isBurnable: await instance.methods.supportsInterface('0x42966c68').call(),
    isMutable: await instance.methods.supportsInterface('0x33b641ae').call(),
    isPausable: await instance.methods.supportsInterface('0xbedb86fb').call(),
    isRevokable: await instance.methods.supportsInterface('0x20c5429b').call(),
  };
}
