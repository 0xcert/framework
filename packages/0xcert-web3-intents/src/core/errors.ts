import { TransactionError } from '@0xcert/intents';

/**
 * Converts Web3 error into unified ConnectorError defined by the framework.
 * @param error Error object.
 */
export function parseError(error: any) {
  return new TransactionError(0, error);
}
