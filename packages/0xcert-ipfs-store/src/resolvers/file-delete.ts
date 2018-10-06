import { IFileDeleteStoreRequest as IStoreRequest,
  IFileDeleteStoreResponse as IStoreResponse } from '@0xcert/store';
import { Store } from '../core/store';

/**
 * Store request resolver for StoreAction.FILE_DELETE.
 * @param store Store class instance.
 * @param req Store request object.
 */
export default async function(store: Store, req: IStoreRequest): Promise<IStoreResponse> {
  return {} as IStoreResponse;
}
