import { Mutation } from '@0xcert/scaffold';
import { parseError } from '@0xcert/web3-errors';

/**
 * 
 */
export async function performMutate(resolver: () => any): Promise<Mutation> {
  try {
    return {
      hash: await new Promise((resolve, reject) => {
        resolver()
          .once('transactionHash', resolve)
          .once('error', reject);
      }) as string,
    };
  } catch (error) {
    throw parseError(error);
  }
}
