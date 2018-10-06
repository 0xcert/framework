import { IFileCreateStoreRequest as IStoreRequest,
  IFileCreateStoreResponse as IStoreResponse } from '@0xcert/store';
import { Store } from '../core/store';

/**
 * Store request resolver for StoreAction.FILE_CREATE.
 * @param store Store class instance.
 * @param req Store request object.
 */
export default async function(store: Store, req: IStoreRequest): Promise<IStoreResponse> {
  return {} as IStoreResponse;
}
