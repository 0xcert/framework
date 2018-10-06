import { IStore, IStoreRequest, IStoreResponse, StoreAction } from '@0xcert/store';
import fileCreate from '../resolvers/file-create';
import fileUpdate from '../resolvers/file-update';
import fileDelete from '../resolvers/file-delete';

/**
 * IPFS store connector.
 */
export class Store implements IStore {

  /**
   * Class constructor.
   */
  public constructor() {
  }

  /**
   * Performs store action based on the received request object.
   * @param res Protocol request object.
   */
  public perform(req: IStoreRequest): IStoreResponse {
    switch (req.action) {
      case StoreAction.FILE_CREATE: 
        return fileCreate.call(this, this, req);
      case StoreAction.FILE_UPDATE: 
        return fileUpdate.call(this, this, req);
      case StoreAction.FILE_DELETE: 
        return fileDelete.call(this, this, req);
      default:
        throw 'Unknown store action'; 
    }
  }

}
