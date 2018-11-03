import { Query } from '@0xcert/connector';
import { parseError } from '@0xcert/web3-errors';

/**
 * 
 */
export async function performQuery<T>(resolver: () => Promise<T>): Promise<Query<T>> {
  try {
    return {
      result: await resolver(),
    };
  } catch (error) {
    throw parseError(error);
  }
}
