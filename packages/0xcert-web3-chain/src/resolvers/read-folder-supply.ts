import { IReadFolderSupplyRequest as IRequest } from '@0xcert/chain';
import { IReadFolderSupplyResponse as IResponse } from '@0xcert/chain';
import { Connector } from '../core/connector';
import * as env from '../config/env';

/**
 * Protocol request resolver for ActionId.READ_FOLDER_SUPPLY.
 * @param con Connector class instance.
 * @param req Protocol request object.
 */
export default async function(con: Connector, req: IRequest): Promise<IResponse> {

  const instance = new con.web3.eth.Contract(env.xcertAbi, req.folderId);

  return {
    totalCount: await instance.methods.totalSupply().call().then((s) => parseInt(s)),
  };
}
