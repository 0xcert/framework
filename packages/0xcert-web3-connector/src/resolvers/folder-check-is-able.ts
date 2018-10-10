import { IFolderCheckIsAbleActionRequest as IActionRequest,
  IFolderCheckIsAbleActionResponse as IActionResponse } from '@0xcert/connector';
import { Connector } from '../core/connector';
import * as env from '../config/env';

/**
 * Connector request resolver for ActionId.FOLDER_CHECK_IS_ABLE.
 * @param con Connector class instance.
 * @param req Protocol request object.
 */
export default async function(connector: Connector, req: IActionRequest): Promise<IActionResponse> {

  const instance = new connector.web3.eth.Contract(env.xcertAbi, req.folderId);

  return {
    isAble: await instance.methods.isAble(req.accountId, req.abilityId).call().catch((e) => false),
  };
}
