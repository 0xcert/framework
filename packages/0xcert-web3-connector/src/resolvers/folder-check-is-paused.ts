import { IFolderCheckIsPausedActionRequest as IActionRequest,
  IFolderCheckIsPausedActionResponse as IActionResponse } from '@0xcert/connector';
import { Connector } from '../core/connector';
import * as env from '../config/env';

/**
 * Connector request resolver for ActionId.FOLDER_CHECK_IS_PAUSED.
 * @param con Connector class instance.
 * @param req Protocol request object.
 */
export default async function(connector: Connector, req: IActionRequest): Promise<IActionResponse> {

  const instance = new connector.web3.eth.Contract(env.xcertAbi, req.folderId);

  return {
    isPaused: await instance.methods.isPaused().call().catch((e) => false),
  };
}
