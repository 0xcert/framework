import { FolderQuery, FolderMutation } from '@0xcert/connector';
import { parseError } from '@0xcert/web3-errors';

/**
 * 
 */
export async function performQuery<T>(resolver: () => Promise<T>): Promise<FolderQuery<T>> {
  try {
    return {
      result: await resolver(),
    };
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * 
 */
export async function performMutate(resolver: () => any): Promise<FolderMutation> {
  try {
    return {
      transactionId: await new Promise((resolve, reject) => {
        resolver()
          .once('transactionHash', resolve)
          .once('error', reject);
      }) as string,
    };
  } catch (error) {
    throw parseError(error);
  }
}
